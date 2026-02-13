'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Submit evidence (results) for a task
 */
export async function submitEvidence(taskId: string, formData: {
    evidence_text: string
    links: string
}) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Validate participation (must be the assigned worker)
    const { data: task } = await supabase
        .from('tasks')
        .select('assigned_worker_id, status, client_id')
        .eq('id', taskId)
        .single()

    if (task?.assigned_worker_id !== user.id) {
        throw new Error('Solo el trabajador asignado puede entregar resultados.')
    }

    // 3. Update task status to SUBMITTED
    const { error: taskError } = await supabase
        .from('tasks')
        .update({
            status: 'SUBMITTED',
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

    if (taskError) throw taskError

    // Step D: Log state change
    await supabase
        .from('state_logs')
        .insert({
            entity_type: 'task',
            entity_id: taskId,
            old_state: 'ASSIGNED',
            new_state: 'SUBMITTED',
            user_id: user.id
        })

    // 5. Notify client
    await supabase
        .from('notifications')
        .insert({
            user_id: task.client_id,
            type: 'task_submitted',
            title: 'Tarea entregada',
            message: 'El trabajador ha entregado los resultados. Revisa la sala de trabajo.',
            link: `/tasks/${taskId}/work`
        })

    revalidatePath(`/tasks/${taskId}/work`)

    return { success: true }
}
