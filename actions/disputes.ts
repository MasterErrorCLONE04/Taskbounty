'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Open a dispute for a task
 */
export async function openDispute(taskId: string, reason: string) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Fetch task details
    const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

    if (fetchError || !task) throw new Error('Tarea no encontrada')

    // 3. SECURE CHECK: Only participants can open disputes
    const isParticipant = user.id === task.client_id || user.id === task.assigned_worker_id
    if (!isParticipant) {
        throw new Error('No tienes permiso para abrir una disputa en esta tarea.')
    }

    // 4. Check if task is in a state that allows disputes
    const allowedStatuses = ['IN_PROGRESS', 'SUBMITTED']
    if (!allowedStatuses.includes(task.status)) {
        throw new Error(`No se puede abrir una disputa en una tarea con estado: ${task.status}`)
    }

    // 5. TRANSACTION: Create dispute and update task status
    // A. Insert dispute record
    const { data: dispute, error: disputeError } = await supabase
        .from('disputes')
        .insert({
            task_id: taskId,
            opened_by: user.id,
            reason: reason,
            status: 'open'
        })
        .select()
        .single()

    if (disputeError) {
        console.error('Dispute Insert Error:', disputeError)
        throw new Error('No se pudo crear el registro de disputa.')
    }

    // B. Update task status to DISPUTED
    const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update({
            status: 'DISPUTED',
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

    if (taskUpdateError) throw taskUpdateError

    // C. Log state change
    await supabase
        .from('state_logs')
        .insert({
            entity_type: 'task',
            entity_id: taskId,
            old_state: task.status,
            new_state: 'DISPUTED',
            user_id: user.id,
            metadata: { dispute_id: dispute.id, reason: reason }
        })

    // D. Notification for the OTHER participant
    const targetUserId = user.id === task.client_id ? task.assigned_worker_id : task.client_id
    if (targetUserId) {
        await supabase
            .from('notifications')
            .insert({
                user_id: targetUserId,
                type: 'dispute_opened',
                title: 'Nueva Disputa Abierta',
                message: `Se ha abierto una disputa por la tarea: ${task.title}. Razón: ${reason}`,
                link: `/tasks/${taskId}/work`
            })
    }

    revalidatePath(`/tasks/${taskId}/work`)
    revalidatePath('/')

    return { success: true, disputeId: dispute.id }
}

/**
 * Resolve a dispute (Admin action simulation)
 * In a real app, this would be highly protected.
 */
export async function resolveDispute(disputeId: string, resolution: 'release' | 'refund', adminComment: string) {
    const supabase = await createClient()

    // 1. Get dispute details
    const { data: dispute, error: disputeFetchError } = await supabase
        .from('disputes')
        .select('*, tasks(*)')
        .eq('id', disputeId)
        .single()

    if (disputeFetchError || !dispute) throw new Error('Disputa no encontrada')

    const task = dispute.tasks
    if (dispute.status !== 'open') throw new Error('Esta disputa ya ha sido resuelta.')

    // 2. Execute resolution
    if (resolution === 'release') {
        // Same logic as approveAndRelease
        // A. Update payment status
        await supabase
            .from('payments')
            .update({ status: 'RELEASED', updated_at: new Date().toISOString() })
            .eq('task_id', task.id)
            .eq('status', 'HELD')

        // B. Update worker balance
        const { data: balance } = await supabase
            .from('balances')
            .select('available_balance')
            .eq('user_id', task.assigned_worker_id)
            .single()

        const currentBalance = balance?.available_balance ? Number(balance.available_balance) : 0
        const newBalance = currentBalance + Number(task.bounty_amount)
        await supabase
            .from('balances')
            .update({ available_balance: newBalance })
            .eq('user_id', task.assigned_worker_id)

        // C. Update task status
        await supabase
            .from('tasks')
            .update({ status: 'COMPLETED' })
            .eq('id', task.id)

    } else if (resolution === 'refund') {
        // Return funds to client balance
        // A. Update payment status
        await supabase
            .from('payments')
            .update({ status: 'REFUNDED', updated_at: new Date().toISOString() })
            .eq('task_id', task.id)
            .eq('status', 'HELD')

        // B. Update client balance
        const { data: balance } = await supabase
            .from('balances')
            .select('available_balance')
            .eq('user_id', task.client_id)
            .single()

        const currentBalance = balance?.available_balance ? Number(balance.available_balance) : 0
        const newBalance = currentBalance + Number(task.bounty_amount)
        await supabase
            .from('balances')
            .update({ available_balance: newBalance })
            .eq('user_id', task.client_id)

        // C. Update task status
        await supabase
            .from('tasks')
            .update({ status: 'CANCELLED' })
            .eq('id', task.id)
    }

    // 3. Update dispute record
    await supabase
        .from('disputes')
        .update({
            status: 'resolved',
            resolution: resolution,
            resolved_at: new Date().toISOString()
        })
        .eq('id', disputeId)

    // 4. Notification for both
    const participants = [task.client_id, task.assigned_worker_id]
    for (const pid of participants) {
        if (!pid) continue
        await supabase
            .from('notifications')
            .insert({
                user_id: pid,
                type: 'dispute_resolved',
                title: 'Disputa Resuelta',
                message: `La disputa ha sido resuelta como: ${resolution === 'release' ? 'Liberación de pago' : 'Reembolso'}.`,
                link: `/tasks/${task.id}/work`
            })
    }

    revalidatePath(`/tasks/${task.id}/work`)
    return { success: true }
}
