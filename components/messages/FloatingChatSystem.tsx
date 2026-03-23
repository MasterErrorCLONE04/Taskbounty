'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { X, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingChatWindow } from '@/components/messages/FloatingChatWindow'
import { usePresence } from '@/hooks/usePresence'

export function FloatingChatSystem() {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [activeChat, setActiveChat] = useState<{
        conversationId: string
        otherUser: any
        lastMessageAt?: number
        latestMessage?: any
    } | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const userRef = useRef<any>(null)
    const isExpandedRef = useRef(isExpanded)

    // Global Presence Tracking
    const { onlineUsers, typingUsers, setTyping } = usePresence(user?.id, isExpanded ? activeChat?.conversationId : undefined)

    // Sync refs
    useEffect(() => {
        isExpandedRef.current = isExpanded
    }, [isExpanded])

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

                    // Check if message belongs to a conversation involving the user
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

                    // Update active chat with the latest message
                    setActiveChat({
                        conversationId: conv.id,
                        otherUser: otherUser,
                        lastMessageAt: Date.now(),
                        latestMessage: newMessage // Pass the actual message row down
                    })
                    
                    // Show toast if not expanded and NOT from me
                    if (!isExpandedRef.current && newMessage.sender_id !== currentUser.id) {
                        setIsVisible(true)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user?.id, pathname])

    if (pathname === '/messages' || !activeChat) return null

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="pointer-events-auto"
                    >
                        <FloatingChatWindow
                            conversationId={activeChat.conversationId}
                            otherUser={activeChat.otherUser}
                            latestMessage={activeChat.latestMessage}
                            currentUserId={user?.id}
                            onlineUsers={onlineUsers}
                            typingUsers={typingUsers}
                            onTypingChangeAction={setTyping}
                            onCloseAction={() => {
                                setIsExpanded(false)
                                setIsVisible(false)
                            }}
                            onMinimizeAction={() => setIsExpanded(false)}
                        />
                    </motion.div>
                ) : isVisible ? (
                    <motion.div
                        key="toast"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        onClick={() => setIsExpanded(true)}
                        className="pointer-events-auto cursor-pointer bg-white rounded-full shadow-lg pl-1.5 pr-4 py-1.5 flex items-center gap-3 border border-slate-100/50 hover:bg-slate-50 transition-all group scale-110"
                    >
                        <div className="relative">
                            <img
                                src={activeChat.otherUser.avatar_url || "https://ui-avatars.com/api/?name=User"}
                                alt={activeChat.otherUser.name}
                                className="w-10 h-10 rounded-full object-cover shadow-sm"
                            />
                        </div>
                        <div className="flex-1 overflow-hidden pr-2">
                            <h3 className="text-slate-800 font-bold text-[14px] truncate max-w-[150px]">
                                {activeChat.otherUser.name}
                            </h3>
                        </div>
                        <div className="w-px h-6 bg-slate-100 mx-1" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsVisible(false)
                            }}
                            className="text-slate-400 hover:text-slate-600 transition-all"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}
