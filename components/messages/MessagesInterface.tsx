"use client"

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ContactList } from "@/components/messages/ContactList"
import { ChatWindow } from "@/components/messages/ChatWindow"
import { formatDistanceToNow } from 'date-fns'
import { usePresence } from '@/hooks/usePresence'

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
    const { onlineUsers, typingUsers, setTyping } = usePresence(currentUserId, activeId || undefined)

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
    }

    return (
        <div className="flex h-full bg-white overflow-hidden">
            <ContactList
                contacts={contacts}
                activeId={activeId || undefined}
                onSelect={handleSelectContact}
                onlineUsers={onlineUsers}
            />
            {activeId && activeConversation ? (
                <ChatWindow
                    conversation={activeConversation}
                    currentUserId={currentUserId}
                    isOtherUserOnline={onlineUsers.has(activeConversation.otherUser?.id)}
                    isOtherUserTyping={typingUsers.has(activeConversation.otherUser?.id)}
                    onTypingChange={setTyping}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    )
}
