'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Send a message in a TASK work room (Old logic kept for compatibility)
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

/**
 * Start a conversation with a user (Direct Message)
 * - Checks if one exists (A-B or B-A)
 * - Returns the conversation ID
 */
export async function startConversation(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }
    if (user.id === targetUserId) return { error: 'Cannot message yourself' }

    // Ensure user1_id < user2_id for consistent ordering
    const user1 = user.id < targetUserId ? user.id : targetUserId
    const user2 = user.id < targetUserId ? targetUserId : user.id

    // Check availability
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('user1_id', user1)
        .eq('user2_id', user2)
        .single()

    if (existing) {
        return { conversationId: existing.id }
    }

    // Create new
    const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
            user1_id: user1,
            user2_id: user2,
            last_message: 'Started conversation',
            last_message_at: new Date().toISOString()
        })
        .select('id')
        .single()

    if (error) {
        console.error('Error creating conversation:', error)
        return { error: error.message }
    }

    return { conversationId: newConv.id }
}

/**
 * Get all conversations for current user
 */
export async function getConversations() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch conversations where user is user1 OR user2
    const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
            *,
            user1:user1_id(id, name, avatar_url),
            user2:user2_id(id, name, avatar_url)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

    if (error) {
        console.error('Error fetching conversations:', error)
        return []
    }

    // Transform to friendly format
    return conversations.map(c => {
        const otherUser = c.user1_id === user.id ? c.user2 : c.user1
        return {
            id: c.id,
            otherUser: otherUser,
            lastMessage: c.last_message,
            lastMessageAt: c.last_message_at,
            time: c.last_message_at // for UI compatibility
        }
    })
}

/**
 * Get messages for a specific conversation
 */
export async function getDirectMessages(conversationId: string) {
    const supabase = await createClient()

    const { data: messages, error } = await supabase
        .from('direct_messages')
        .select(`
            *,
            sender:sender_id(id, name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) return []
    return messages
}

/**
 * Send a direct message
 */
export async function sendDirectMessage(conversationId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // 1. Insert message
    const { error } = await supabase
        .from('direct_messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content
        })

    if (error) throw error

    // 2. Update conversation last_message
    await supabase
        .from('conversations')
        .update({
            last_message: content,
            last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId)

    revalidatePath('/messages')
    return { success: true }
}
