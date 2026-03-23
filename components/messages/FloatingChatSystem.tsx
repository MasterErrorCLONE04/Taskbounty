'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { X, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingChatWindow } from '@/components/messages/FloatingChatWindow'
import { useGlobalPresence } from '@/context/PresenceContext'

export function FloatingChatSystem() {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [activeChats, setActiveChats] = useState<{
        conversationId: string
        otherUser: any
        lastMessageAt: number
        latestMessage?: any
        isExpanded: boolean
        isVisible: boolean
    }[]>([])

    const userRef = useRef<any>(null)
    const activeChatsRef = useRef(activeChats)

    // Global Presence Tracking
    const { onlineUsers } = useGlobalPresence()

    // Sync refs
    useEffect(() => {
        activeChatsRef.current = activeChats
    }, [activeChats])

    // 1. Get current user & listen to auth changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user || null
            setUser(currentUser)
            userRef.current = currentUser
        })

        // Initial check
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            userRef.current = user
        })

        return () => subscription.unsubscribe()
    }, [])

    // 2. Subscribe to real-time message NOTIFICATIONS
    useEffect(() => {
        if (!user || pathname === '/messages') return

        const channel = supabase.channel(`notifications:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'direct_messages'
                },
                async (payload) => {
                    const newMessage = payload.new
                    const currentUser = userRef.current
                    if (!currentUser) return

                    // Check if already in active chats
                    const existingIndex = activeChatsRef.current.findIndex(c => c.conversationId === newMessage.conversation_id)

                    if (existingIndex !== -1) {
                        // Just update the latest message and show toast if not expanded
                        setActiveChats(prev => prev.map((c, i) => i === existingIndex ? {
                            ...c,
                            latestMessage: newMessage,
                            lastMessageAt: Date.now(),
                            isVisible: c.isExpanded ? c.isVisible : (newMessage.sender_id !== currentUser.id ? true : c.isVisible)
                        } : c))
                    } else {
                        // New conversation - check if we have room (max 3)
                        if (activeChatsRef.current.length >= 3) return

                        // Fetch conversation info
                        const { data: conv, error } = await supabase
                            .from('conversations')
                            .select(`
                                id,
                                user1:user1_id(id, name, avatar_url),
                                user2:user2_id(id, name, avatar_url)
                            `)
                            .eq('id', newMessage.conversation_id)
                            .single()

                        if (error || !conv) return
                        const convData = conv as any
                        const user1 = convData.user1
                        const user2 = convData.user2

                        // Check if current user is part of this conversation
                        if (user1.id !== currentUser.id && user2.id !== currentUser.id) return
                        const otherUser = user1.id === currentUser.id ? user2 : user1

                        setActiveChats(prev => {
                            if (prev.length >= 3) return prev
                            return [...prev, {
                                conversationId: conv.id,
                                otherUser: otherUser,
                                lastMessageAt: Date.now(),
                                latestMessage: newMessage,
                                isExpanded: false,
                                isVisible: newMessage.sender_id !== currentUser.id
                            }]
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user?.id, pathname])

    const toggleExpand = (id: string, expanded: boolean) => {
        setActiveChats(prev => prev.map(c => c.conversationId === id ? { ...c, isExpanded: expanded, isVisible: expanded ? true : c.isVisible } : c))
    }

    const closeChat = (id: string) => {
        setActiveChats(prev => prev.filter(c => c.conversationId !== id))
    }

    const setVisible = (id: string, visible: boolean) => {
        setActiveChats(prev => prev.map(c => c.conversationId === id ? { ...c, isVisible: visible } : c))
    }

    // Early return for rendering ONLY, but keep hooks active above
    const isUIHidden = pathname === '/messages'

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-row-reverse items-end gap-6 pointer-events-none pr-6">
            {!isUIHidden && activeChats.map((chat) => (
                <div key={chat.conversationId} className="pointer-events-none flex flex-col items-end gap-4">
                    <AnimatePresence mode="wait">
                        {chat.isExpanded ? (
                            <motion.div
                                key={`${chat.conversationId}-expanded`}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="pointer-events-auto"
                            >
                                <FloatingChatWindow
                                    conversationId={chat.conversationId}
                                    otherUser={chat.otherUser}
                                    latestMessage={chat.latestMessage}
                                    currentUserId={user?.id}
                                    onCloseAction={() => closeChat(chat.conversationId)}
                                    onMinimizeAction={() => toggleExpand(chat.conversationId, false)}
                                />
                            </motion.div>
                        ) : chat.isVisible ? (
                            <motion.div
                                key={`${chat.conversationId}-toast`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                onClick={() => toggleExpand(chat.conversationId, true)}
                                className="pointer-events-auto cursor-pointer bg-white rounded-full shadow-lg pl-1.5 pr-4 py-1.5 flex items-center gap-3 border border-slate-100/50 hover:bg-slate-50 transition-all group scale-110"
                            >
                                <div className="relative">
                                    <img
                                        src={chat.otherUser.avatar_url || "https://ui-avatars.com/api/?name=User"}
                                        alt={chat.otherUser.name}
                                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                                    />
                                </div>
                                <div className="flex-1 overflow-hidden pr-2">
                                    <h3 className="text-slate-800 font-bold text-[14px] truncate max-w-[150px]">
                                        {chat.otherUser.name}
                                    </h3>
                                </div>
                                <div className="w-px h-6 bg-slate-100 mx-1" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setVisible(chat.conversationId, false)
                                    }}
                                    className="text-slate-400 hover:text-slate-600 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}
