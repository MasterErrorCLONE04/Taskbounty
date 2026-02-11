import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function usePresence(userId: string | undefined, conversationId?: string) {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (!userId) return

        // 1. Global Presence Channel
        const globalChannel = supabase.channel('presence-global', {
            config: {
                presence: {
                    key: userId,
                },
            },
        })

            ; (globalChannel as any)
                .on('presence', { event: 'sync' }, () => {
                    const state = globalChannel.presenceState()
                    const onlineIds = new Set<string>(Object.keys(state))
                    setOnlineUsers(onlineIds)
                })
                .subscribe(async (status: string) => {
                    if (status === 'SUBSCRIBED') {
                        await globalChannel.track({
                            online_at: new Date().toISOString(),
                        })
                    }
                })

        // 2. Conversation Specific Typing Channel
        let typingChannel: any = null
        if (conversationId) {
            typingChannel = supabase.channel(`typing-${conversationId}`, {
                config: {
                    presence: {
                        key: userId,
                    },
                },
            })

            typingChannel
                .on('presence', { event: 'sync' }, () => {
                    const state = typingChannel.presenceState()
                    const typingIds = new Set<string>()

                    Object.entries(state).forEach(([key, presences]: [string, any]) => {
                        if (key === userId) return
                        if (presences.some((p: any) => p.isTyping)) {
                            typingIds.add(key)
                        }
                    })

                    setTypingUsers(typingIds)
                })
                .subscribe()
        }

        return () => {
            globalChannel.unsubscribe()
            if (typingChannel) typingChannel.unsubscribe()
        }
    }, [userId, conversationId])

    const setTyping = (isTyping: boolean) => {
        if (!userId || !conversationId) return
        const channel = supabase.channel(`typing-${conversationId}`)
        channel.track({ isTyping })
    }

    return { onlineUsers, typingUsers, setTyping }
}
