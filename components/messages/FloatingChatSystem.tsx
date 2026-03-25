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
        unreadCount: number
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
                        const isFromOther = newMessage.sender_id !== currentUser.id
                        setActiveChats(prev => prev.map((c, i) => i === existingIndex ? {
                            ...c,
                            latestMessage: newMessage,
                            lastMessageAt: Date.now(),
                            isVisible: c.isExpanded ? c.isVisible : (isFromOther ? true : c.isVisible),
                            unreadCount: (!c.isExpanded && isFromOther) ? c.unreadCount + 1 : c.unreadCount
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
                            const isFromOther = newMessage.sender_id !== currentUser.id
                            return [...prev, {
                                conversationId: conv.id,
                                otherUser: otherUser,
                                lastMessageAt: Date.now(),
                                latestMessage: newMessage,
                                isExpanded: false,
                                isVisible: isFromOther,
                                unreadCount: isFromOther ? 1 : 0
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
        setActiveChats(prev => prev.map(c => c.conversationId === id ? {
            ...c,
            isExpanded: expanded,
            isVisible: expanded ? true : c.isVisible,
            unreadCount: expanded ? 0 : c.unreadCount
        } : c))
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
        <div className="fixed bottom-0 right-6 z-[9999] flex flex-row-reverse items-end gap-3 pointer-events-none">
            {!isUIHidden && activeChats.map((chat) => (
                <div key={chat.conversationId} className="pointer-events-none flex flex-col items-end gap-2">
                    <AnimatePresence mode="wait">
                        {chat.isExpanded ? (
                            <motion.div
                                key={`${chat.conversationId}-expanded`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ type: "spring", damping: 25, stiffness: 350 }}
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
                                key={`${chat.conversationId}-bubble`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ type: "spring", damping: 20, stiffness: 400 }}
                                className="pointer-events-auto relative group mb-3"
                            >
                                {/* Close button — shows on hover */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setVisible(chat.conversationId, false)
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-sm"
                                >
                                    <X size={10} strokeWidth={3} className="text-slate-600" />
                                </button>

                                {/* Avatar bubble */}
                                <button
                                    onClick={() => toggleExpand(chat.conversationId, true)}
                                    className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                >
                                    <img
                                        src={chat.otherUser.avatar_url || "https://ui-avatars.com/api/?name=User"}
                                        alt={chat.otherUser.name}
                                        className="w-12 h-12 rounded-full object-cover shadow-lg ring-2 ring-white"
                                    />
                                    {/* Online dot */}
                                    {onlineUsers.has(chat.otherUser.id) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                    )}
                                    {/* Unread badge */}
                                    {chat.unreadCount > 0 && (
                                        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-md border-2 border-white">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Name tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                                    {chat.otherUser.name}
                                    {chat.latestMessage?.content && (
                                        <p className="text-[9px] text-slate-300 truncate max-w-[150px] mt-0.5">
                                            {chat.latestMessage.sender_id === user?.id ? 'Tú: ' : ''}{chat.latestMessage.content}
                                        </p>
                                    )}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}
