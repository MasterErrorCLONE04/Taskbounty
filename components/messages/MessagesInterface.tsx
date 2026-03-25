"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ContactList } from "@/components/messages/ContactList"
import { ChatWindow } from "@/components/messages/ChatWindow"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useGlobalPresence } from '@/context/PresenceContext'
import { supabase } from '@/lib/supabase/client'

interface MessagesInterfaceProps {
    initialConversations: any[]
    currentUserId?: string
}

export function MessagesInterface({ initialConversations, currentUserId }: MessagesInterfaceProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const activeId = searchParams.get('id')

    const [conversations, setConversations] = useState(initialConversations)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isChatFullWidth, setIsChatFullWidth] = useState(false)
    
    // Unified presence from context (online + typing)
    const { onlineUsers, typingUsers: typingMap, setTyping: setGlobalTyping } = useGlobalPresence()

    // Real-time update for contact list last message preview
    useEffect(() => {
        if (!currentUserId) return

        const channel = supabase.channel('messages-sidebar-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'direct_messages'
                },
                (payload) => {
                    const msg = payload.new as any
                    setConversations(prev => prev.map(conv => {
                        if (conv.id === msg.conversation_id) {
                            return {
                                ...conv,
                                lastMessage: msg.content,
                                time: msg.created_at
                            }
                        }
                        return conv
                    }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUserId])

    // Derive a Set of users typing in the active conversation (for ChatWindow compatibility)
    const typingUsers = new Set<string>()
    typingMap.forEach((convId, usrId) => {
        if (convId === activeId) typingUsers.add(usrId)
    })

    // Wrapper: setTyping(true) → setGlobalTyping(activeId), setTyping(false) → setGlobalTyping(null)
    const setTyping = async (isTyping: boolean) => {
        setGlobalTyping(isTyping ? (activeId || null) : null)
    }


    // Derived active conversation
    const activeConversation = conversations.find(c => c.id === activeId)

    // Transform conversations to Contact format expected by ContactList
    const contacts = conversations.map(c => ({
        id: c.id,
        name: c.otherUser?.name || 'Unknown',
        avatar: c.otherUser?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random',
        lastMessage: c.lastMessage || 'Started a conversation',
        time: c.time ? formatDistanceToNow(new Date(c.time), { addSuffix: true }).replace('about ', '') : 'New',
        isActive: c.id === activeId,
        otherUserId: c.otherUser?.id
    }))

    const handleSelectContact = (id: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('id', id)
        router.push(`${pathname}?${params.toString()}`)
        // If we were in empty state and select someone, maybe we don't want to hide sidebar? 
        // User hasn't specified auto-hiding, so let's keep it manual.
    }

    return (
        <div className="flex h-full bg-white overflow-hidden relative">
            {!isChatFullWidth && (
                <ContactList
                    contacts={contacts}
                    activeId={activeId || undefined}
                    onSelect={handleSelectContact}
                    onlineUsers={onlineUsers}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            )}

            {activeId && activeConversation ? (
                <ChatWindow
                    conversation={activeConversation}
                    currentUserId={currentUserId}
                    isOtherUserOnline={onlineUsers.has(activeConversation.otherUser?.id)}
                    isOtherUserTyping={typingUsers.has(activeConversation.otherUser?.id)}
                    onTypingChange={setTyping}
                    isFullWidth={isChatFullWidth}
                    onToggleFullWidth={() => setIsChatFullWidth(!isChatFullWidth)}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                    <p>Selecciona una conversación para empezar</p>
                    {isChatFullWidth && (
                        <button
                            onClick={() => setIsChatFullWidth(false)}
                            className="mt-4 text-blue-500 font-bold hover:underline"
                        >
                            Mostrar lista de conversaciones
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
