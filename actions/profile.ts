'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Update the current user's professional profile
 */
export async function updateProfile(formData: {
    bio?: string
    skills?: string[]
    avatar_url?: string
    name?: string
}) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('No autorizado')

    // 2. Perform update
    const { error: updateError } = await supabase
        .from('users')
        .update({
            ...formData
        })
        .eq('id', user.id)

    if (updateError) {
        console.error('Profile Update Error:', updateError)
        throw new Error('Error al actualizar el perfil')
    }

    revalidatePath(`/profiles/${user.id}`)
    revalidatePath('/client/dashboard')
    revalidatePath('/worker/dashboard')

    return { success: true }
}

/**
 * Fetch a user's public profile and stats
 */
export async function getPublicProfile(userId: string) {
    const supabase = await createClient()

    // 1. Get user direct info
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (userError || !user) return null

    // 2. Fetch stats (COMPLETED tasks)
    const { data: completedTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, bounty_amount, category, created_at')
        .eq('assigned_worker_id', userId)
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false })

    if (tasksError) console.error('Stats Fetch Error:', tasksError)

    const totalEarned = completedTasks?.reduce((sum, task) => sum + Number(task.bounty_amount), 0) || 0
    const taskCount = completedTasks?.length || 0

    return {
        ...user,
        stats: {
            totalEarned,
            taskCount,
            portfolio: completedTasks || []
        }
    }
}
