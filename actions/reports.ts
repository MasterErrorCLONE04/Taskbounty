
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reportTask(taskId: string, reason: string, details?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const { error } = await supabase
            .from('task_reports')
            .insert({
                task_id: taskId,
                reporter_id: user.id,
                reason,
                details
            })

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error reporting task:', error)
        return { success: false, error: 'Failed to report task' }
    }
}

export async function hideTask(taskId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const { error } = await supabase
            .from('task_hides')
            .insert({
                task_id: taskId,
                user_id: user.id
            })

        if (error) {
            // Ignore unique constraint violation (already hidden)
            if (error.code !== '23505') throw error
        }

        revalidatePath('/tasks')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error hiding task:', error)
        return { success: false, error: 'Failed to hide task' }
    }
}
