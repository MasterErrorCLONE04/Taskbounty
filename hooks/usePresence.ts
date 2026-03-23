import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

export function usePresence(userId?: string, conversationId?: string) {
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const channelRef = useRef<any>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!userId || !conversationId) {
            setTypingUsers(new Set())
            return
        }

        // Use a random key for the presence channel to avoid conflicts between tabs
        // We'll pass the actual userId in the presence payload
        const channel = supabase.channel(`typing-${conversationId}`)

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const typingIds = new Set<string>()

                // Iterate through all presences from all sessions/tabs
                Object.values(state).forEach((presences: any) => {
                    presences.forEach((p: any) => {
                        if (p.user_id && p.user_id !== userId && p.isTyping) {
                            typingIds.add(p.user_id)
                        }
                    })
                })
                
                setTypingUsers(typingIds)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Start with not typing
                    await channel.track({ user_id: userId, isTyping: false })
                }
            })

        channelRef.current = channel

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
            setTypingUsers(new Set())
        }
    }, [userId, conversationId])

    const setTyping = async (isTyping: boolean) => {
        if (!channelRef.current || !userId) return
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

        if (channelRef.current.state === 'joined') {
            await channelRef.current.track({ user_id: userId, isTyping })

            if (isTyping) {
                typingTimeoutRef.current = setTimeout(async () => {
                    if (channelRef.current?.state === 'joined') {
                        await channelRef.current.track({ user_id: userId, isTyping: false })
                    }
                }, 3000)
            }
        }
    }

    return { typingUsers, setTyping }
}
