import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function usePresence(userId: string | undefined, conversationId?: string) {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const [typingChannel, setTypingChannel] = useState<any>(null)

    // 1. Global Presence (Online Status)
    useEffect(() => {
        if (!userId) return

        const globalChannel = supabase.channel('presence-global', {
            config: { presence: { key: userId } },
        })

        globalChannel
            .on('presence', { event: 'sync' }, () => {
                const state = globalChannel.presenceState()
                const onlineIds = new Set<string>(Object.keys(state))
                setOnlineUsers(onlineIds)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await globalChannel.track({ online_at: new Date().toISOString() })
                }
            })

        return () => {
            supabase.removeChannel(globalChannel)
        }
    }, [userId])

    // 2. Typing Presence (Conversation specific)
    useEffect(() => {
        if (!userId || !conversationId) {
            setTypingUsers(new Set())
            return
        }

        const channel = supabase.channel(`typing-${conversationId}`, {
            config: { presence: { key: userId } },
        })

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const typingIds = new Set<string>()

                for (const key in state) {
                    if (key === userId) continue // Ignore self
                    // Check if *any* presence for this user has isTyping: true
                    const userPresences = state[key] as any[]
                    if (userPresences.some(p => p.isTyping)) {
                        typingIds.add(key)
                    }
                }
                setTypingUsers(typingIds)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Initial state: not typing
                    await channel.track({ isTyping: false })
                }
            })

        setTypingChannel(channel)

        return () => {
            supabase.removeChannel(channel)
            setTypingChannel(null)
        }
    }, [userId, conversationId])

    const setTyping = async (isTyping: boolean) => {
        if (typingChannel) {
            await typingChannel.track({ isTyping })
        }
    }

    return { onlineUsers, typingUsers, setTyping }
}
