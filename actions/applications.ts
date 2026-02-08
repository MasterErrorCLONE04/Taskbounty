'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Submit an application for a task
 */
export async function submitApplication(taskId: string, formData: {
    proposal_text: string
    estimated_time: string
}) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Validate user role (worker or both)
    if (user.user_metadata.role === 'client') {
        throw new Error('Solo los trabajadores pueden aplicar a tareas.')
    }

    // 3. Check if user is trying to apply to their own task
    const { data: task } = await supabase
        .from('tasks')
        .select('client_id, status')
        .eq('id', taskId)
        .single()

    if (task?.client_id === user.id) {
        throw new Error('No puedes aplicar a tu propia tarea.')
    }

    if (task?.status !== 'OPEN') {
        throw new Error('Esta tarea ya no acepta aplicaciones.')
    }

    // 4. Check for existing application
    const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('task_id', taskId)
        .eq('worker_id', user.id)
        .single()

    if (existingApp) {
        throw new Error('Ya has aplicado a esta tarea.')
    }

    // 5. Insert application
    const { error: insertError } = await supabase
        .from('applications')
        .insert({
            task_id: taskId,
            worker_id: user.id,
            proposal_text: formData.proposal_text,
            estimated_time: formData.estimated_time,
            status: 'pending'
        })

    if (insertError) throw insertError

    // 6. Notify client (Mocking notification for now)
    await supabase
        .from('notifications')
        .insert({
            user_id: task.client_id,
            type: 'new_application',
            title: 'Nueva aplicación',
            message: 'Un trabajador se ha postulado a tu tarea.',
            link: `/tasks/${taskId}/manage`
        })

    revalidatePath(`/tasks/${taskId}`)
    revalidatePath('/worker/dashboard')

    return { success: true }
}

/**
 * Accept an application and assign the worker
 */
export async function acceptApplication(taskId: string, applicationId: string, workerId: string) {
    const supabase = await createClient()

    // 1. Get current user (client)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Verify task ownership
    const { data: task } = await supabase
        .from('tasks')
        .select('client_id, status')
        .eq('id', taskId)
        .single()

    if (task?.client_id !== user.id) {
        throw new Error('Unauthorized: No eres el dueño de esta tarea.')
    }

    if (task?.status !== 'OPEN') {
        throw new Error('La tarea debe estar en estado OPEN para asignar un trabajador.')
    }

    // 3. Start transaction (Update task and applications)
    // Step A: Update task status to ASSIGNED and set worker_id
    const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update({
            status: 'ASSIGNED',
            assigned_worker_id: workerId,
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

    if (taskUpdateError) throw taskUpdateError

    // Step B: Update application status to accepted
    await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId)

    // Step C: Reject all other applications
    await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('task_id', taskId)
        .neq('id', applicationId)

    // Step D: Log state change
    await supabase
        .from('state_logs')
        .insert({
            entity_type: 'task',
            entity_id: taskId,
            old_state: 'OPEN',
            new_state: 'ASSIGNED',
            user_id: user.id,
            metadata: { accepted_application_id: applicationId, assigned_worker_id: workerId }
        })

    // 4. Notify worker
    await supabase
        .from('notifications')
        .insert({
            user_id: workerId,
            type: 'task_assigned',
            title: '¡Tarea Asignada!',
            message: 'Has sido seleccionado para realizar una tarea. ¡Empieza ahora!',
            link: `/tasks/${taskId}/work`
        })

    revalidatePath(`/tasks/${taskId}`)
    revalidatePath(`/tasks/${taskId}/manage`)
    revalidatePath('/client/dashboard')
    revalidatePath('/worker/dashboard')

    return { success: true }
}
