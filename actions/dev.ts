'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Manually activates a task (Bypasses Stripe webhook for development)
 */
export async function forceActivateTask(taskId: string) {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error('Esta acción solo está permitida en entorno de desarrollo.')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Verify task belongs to user
    const { data: task } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', taskId)
        .eq('client_id', user.id)
        .single()

    if (!task) throw new Error('Tarea no encontrada.')
    if (task.status !== 'DRAFT') throw new Error('Solo las tareas en borrador pueden ser forzadas.')

    // 2. Perform same logic as Stripe Webhook
    // 2.1 Update payment status (if exists)
    await supabase
        .from('payments')
        .update({ status: 'HELD', updated_at: new Date().toISOString() })
        .eq('task_id', taskId)

    // 2.2 Update task status
    const { error } = await supabase
        .from('tasks')
        .update({ status: 'OPEN', updated_at: new Date().toISOString() })
        .eq('id', taskId)

    if (error) throw error

    // 2.3 Log state change
    await supabase
        .from('state_logs')
        .insert({
            entity_type: 'task',
            entity_id: taskId,
            old_state: 'DRAFT',
            new_state: 'OPEN',
            user_id: user.id,
            metadata: { manual_bypass: true }
        })

    revalidatePath(`/tasks/${taskId}/manage`)
    revalidatePath('/tasks/explore')
    revalidatePath('/client/dashboard')

    return { success: true }
}
