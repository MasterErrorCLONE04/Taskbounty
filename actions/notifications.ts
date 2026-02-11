'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotifications(limit = 20) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching notifications:', error)
        return []
    }

    return notifications
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient()

    // We don't necessarily need to check auth user match if RLS handles it, 
    // but good practice to ensure session exists.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id) // Ensure ownership

    if (error) {
        console.error('Error marking notification as read:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/notifications')
    return { success: true }
}

export async function markAllAsRead() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

    if (error) {
        console.error('Error marking all notifications as read:', error)
        return { success: false }
    }

    revalidatePath('/notifications')
    return { success: true }
}
