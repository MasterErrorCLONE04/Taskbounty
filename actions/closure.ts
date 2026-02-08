'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Approve a task, transition status to COMPLETED, and release funds from escrow to worker balance.
 */
export async function approveAndRelease(taskId: string) {
    const supabase = await createClient()

    // 1. Get current user (client)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Fetch task details (Simplified query for robustness)
    const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

    if (fetchError || !task) {
        console.error('ApproveAndRelease Fetch Error:', fetchError)
        console.error('Task ID attempted:', taskId)
        throw new Error('Tarea no encontrada')
    }
    if (task.client_id !== user.id) throw new Error('Unauthorized: No eres el dueño de esta tarea.')
    if (task.status !== 'SUBMITTED') {
        throw new Error('La tarea debe haber sido entregada para poder ser aprobada.')
    }

    // 3. SECURE TRANSACTION: Release funds to worker
    // In a real app, this would also include a Stripe Capture if we were doing it on-demand,
    // but here we move money from 'escrow' (payments table) to 'worker balance'.

    // Step A: Update payment status to RELEASED
    const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'RELEASED', updated_at: new Date().toISOString() })
        .eq('task_id', taskId)
        .eq('status', 'HELD')

    if (paymentError) throw paymentError

    // Step B: Update worker's balance (available_balance)
    // Get current worker balance
    const { data: balance, error: balanceFetchError } = await supabase
        .from('balances')
        .select('available_balance')
        .eq('user_id', task.assigned_worker_id)
        .single()

    if (balanceFetchError) throw balanceFetchError

    const newBalance = Number(balance.available_balance) + Number(task.bounty_amount)

    const { error: balanceUpdateError } = await supabase
        .from('balances')
        .update({
            available_balance: newBalance,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', task.assigned_worker_id)

    if (balanceUpdateError) throw balanceUpdateError

    // Step C: Mark task as COMPLETED
    const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update({
            status: 'COMPLETED',
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

    if (taskUpdateError) throw taskUpdateError

    // Step D: Log state change
    await supabase
        .from('state_logs')
        .insert({
            entity_type: 'task',
            entity_id: taskId,
            old_state: 'SUBMITTED',
            new_state: 'COMPLETED',
            user_id: user.id,
            metadata: { released_amount: task.bounty_amount }
        })

    // 4. Notifications
    await supabase
        .from('notifications')
        .insert({
            user_id: task.assigned_worker_id,
            type: 'payment_released',
            title: '¡Pago liberado!',
            message: `El cliente ha aprobado tu entrega y se han acreditado $${task.bounty_amount} en tu balance.`,
            link: '/worker/dashboard'
        })

    revalidatePath(`/tasks/${taskId}/work`)
    revalidatePath('/worker/dashboard')
    revalidatePath('/client/dashboard')

    return { success: true }
}

/**
 * Submit a rating for a user (inserts into reviews table)
 */
export async function submitRating(taskId: string, targetUserId: string, rating: number, comment: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Verify task status and participation
    const { data: task } = await supabase
        .from('tasks')
        .select('status, client_id, assigned_worker_id')
        .eq('id', taskId)
        .single()

    if (!task) throw new Error('Tarea no encontrada.')
    if (task.status !== 'COMPLETED') {
        throw new Error('Solo puedes calificar cuando la tarea está completada.')
    }

    const isParticipant = user.id === task.client_id || user.id === task.assigned_worker_id
    if (!isParticipant) {
        throw new Error('No tienes permiso para calificar en esta tarea.')
    }

    // 2. Insert the review
    // The SQL Trigger 'on_review_submitted' will automatically update the average in 'users' table.
    const { error } = await supabase
        .from('reviews')
        .insert({
            task_id: taskId,
            reviewer_id: user.id,
            target_id: targetUserId,
            rating: rating,
            comment: comment
        })

    if (error) {
        console.error('SubmitRating Error:', error)
        throw new Error('No pudimos guardar tu calificación.')
    }

    revalidatePath(`/tasks/${taskId}/work`)

    return { success: true }
}
