'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

interface PresenceContextType {
    onlineUsers: Set<string>
    typingUsers: Map<string, string> // userId -> conversationId they're typing in
    setTyping: (conversationId: string | null) => void
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined)

export function PresenceProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | undefined>(undefined)
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map())
    const channelRef = useRef<any>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const currentTypingConvRef = useRef<string | null>(null)

    // Handle Auth
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id)
        })

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Handle Presence (online + typing via single channel)
    useEffect(() => {
        if (!userId) {
            setOnlineUsers(new Set())
            setTypingUsers(new Map())
            return
        }

        const globalChannel = supabase.channel('presence-global', {
            config: { presence: { key: userId } },
        })

        globalChannel
            .on('presence', { event: 'sync' }, () => {
                const state = globalChannel.presenceState()
                const onlineIds = new Set<string>()
                const typing = new Map<string, string>()

                for (const key of Object.keys(state)) {
                    onlineIds.add(key)
                    const presences = state[key] as any[]
                    // Check the latest presence for typing info
                    const latest = presences[presences.length - 1]
                    if (latest?.typing_in) {
                        typing.set(key, latest.typing_in)
                    }
                }

                setOnlineUsers(onlineIds)
                setTypingUsers(typing)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    setTimeout(async () => {
                        await globalChannel.track({
                            online_at: new Date().toISOString(),
                            typing_in: null
                        })
                    }, 500)
                }
            })

        channelRef.current = globalChannel

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }
    }, [userId])

    // setTyping: pass conversationId to mark typing, null to stop
    const setTyping = useCallback((conversationId: string | null) => {
        if (!channelRef.current || channelRef.current.state !== 'joined') return

        // Clear existing timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

        currentTypingConvRef.current = conversationId

        channelRef.current.track({
            online_at: new Date().toISOString(),
            typing_in: conversationId
        })

        // Auto-clear typing after 3 seconds of inactivity
        if (conversationId) {
            typingTimeoutRef.current = setTimeout(() => {
                if (channelRef.current?.state === 'joined') {
                    currentTypingConvRef.current = null
                    channelRef.current.track({
                        online_at: new Date().toISOString(),
                        typing_in: null
                    })
                }
            }, 3000)
        }
    }, [])

    return (
        <PresenceContext.Provider value={{ onlineUsers, typingUsers, setTyping }}>
            {children}
        </PresenceContext.Provider>
    )
}

export function useGlobalPresence() {
    const context = useContext(PresenceContext)
    if (context === undefined) {
        throw new Error('useGlobalPresence must be used within a PresenceProvider')
    }
    return context
}
