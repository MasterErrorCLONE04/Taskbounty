'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function followUser(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }
    if (user.id === targetUserId) return { success: false, error: 'Cannot follow yourself' }

    // Check if checks already exist
    const { error } = await supabase
        .from('follows')
        .insert({
            follower_id: user.id,
            following_id: targetUserId
        })

    if (error) {
        console.error('Error following user:', error)
        return { success: false, error: error.message }
    }

    // Notification handled by DB trigger 'on_follow_created'

    revalidatePath(`/profile/${targetUserId}`)
    return { success: true }
}

export async function unfollowUser(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('follows')
        .delete()
        .match({
            follower_id: user.id,
            following_id: targetUserId
        })

    if (error) {
        console.error('Error unfollowing user:', error)
        return { success: false, error: error.message }
    }

    revalidatePath(`/profile/${targetUserId}`)
    return { success: true }
}

export async function getFollowStatus(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { isFollowing: false }

    const { data, error } = await supabase
        .from('follows')
        .select('*')
        .match({
            follower_id: user.id,
            following_id: targetUserId
        })
        .single()

    return { isFollowing: !!data }
}

export async function toggleLike(taskId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }

    // Check if like exists
    const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .match({ task_id: taskId, user_id: user.id })
        .single()

    if (existingLike) {
        // Unlike
        await supabase
            .from('likes')
            .delete()
            .match({ task_id: taskId, user_id: user.id })
    } else {
        // Like
        await supabase
            .from('likes')
            .insert({ task_id: taskId, user_id: user.id })

        // Notify owner (implied: fetch task owner first)
        const { data: task } = await supabase.from('tasks').select('client_id').eq('id', taskId).single()
        if (task && task.client_id !== user.id) {
            // Use trigger if possible, but triggers on likes might be spammy. 
            // For now, let's just insert simple notification or rely on trigger if I create one.
            // I'll stick to trigger strategy if possible? 
            // Actually, I don't have a trigger for likes yet. I'll insert manual notification for now or add trigger later.
            // Let's insert manually for now to ensure feedback.
            await supabase.from('notifications').insert({
                user_id: task.client_id,
                type: 'like',
                title: 'New Like',
                message: 'Someone liked your task.',
                link: `/tasks/${taskId}`,
                read: false
            })
        }
    }

    revalidatePath('/')
    revalidatePath(`/tasks/${taskId}`)
    return { success: true, isLiked: !existingLike }
}

export async function addComment(taskId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('comments')
        .insert({
            task_id: taskId,
            user_id: user.id,
            content
        })

    if (error) {
        console.error('Error adding comment:', error)
        return { success: false, error: error.message }
    }

    // Notify owner
    const { data: task } = await supabase.from('tasks').select('client_id').eq('id', taskId).single()
    if (task && task.client_id !== user.id) {
        await supabase.from('notifications').insert({
            user_id: task.client_id,
            type: 'comment',
            title: 'New Comment',
            message: 'Someone commented on your task.',
            link: `/tasks/${taskId}`,
            read: false
        })
    }

    revalidatePath('/')
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
}

export async function getComments(taskId: string) {
    const supabase = await createClient()
    const { data: comments, error } = await supabase
        .from('comments')
        .select(`
            *,
            user:users(id, name, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })

    if (error) return []
    return comments
}

export async function getSocialStats(taskId: string) {
    const supabase = await createClient()

    const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('task_id', taskId)

    const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('task_id', taskId)

    return { likes: likesCount || 0, comments: commentsCount || 0 }
}
