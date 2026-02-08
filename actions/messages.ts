'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Send a message in a task work room
 */
export async function sendMessage(taskId: string, content: string) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Validate participation (client or worker)
    const { data: task } = await supabase
        .from('tasks')
        .select('client_id, assigned_worker_id')
        .eq('id', taskId)
        .single()

    if (task?.client_id !== user.id && task?.assigned_worker_id !== user.id) {
        throw new Error('No tienes permiso para enviar mensajes en esta tarea.')
    }

    // 3. Insert message
    const { error: msgError } = await supabase
        .from('messages')
        .insert({
            task_id: taskId,
            sender_id: user.id,
            message: content
        })

    if (msgError) throw msgError

    revalidatePath(`/tasks/${taskId}/work`)

    return { success: true }
}
