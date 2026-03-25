'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Minus, Send, Paperclip } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { getDirectMessages, sendDirectMessage } from '@/actions/messages'
import { format } from 'date-fns'
import { useGlobalPresence } from '@/context/PresenceContext'

interface FloatingChatWindowProps {
    conversationId: string
    otherUser: any
    latestMessage?: any
    currentUserId?: string
    onCloseAction: () => void
    onMinimizeAction: () => void
}

export function FloatingChatWindow({
    conversationId,
    otherUser,
    latestMessage,
    currentUserId,
    onCloseAction,
    onMinimizeAction
}: FloatingChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Unified presence from context (online + typing)
    const { onlineUsers, typingUsers, setTyping } = useGlobalPresence()

    // Presence integration
    const isOtherUserOnline = otherUser?.id && onlineUsers.has(otherUser.id)
    const isOtherUserTyping = otherUser?.id && typingUsers.get(otherUser.id) === conversationId

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // React to new messages from parent
    useEffect(() => {
        if (!latestMessage) return

        // Ensure the message belongs to this conversation
        if (latestMessage.conversation_id !== conversationId) return

        setMessages(prev => {
            const exists = prev.some(m => m.id === latestMessage.id || (m.isTemp && m.content === latestMessage.content))
            if (exists) {
                // Update temp or existing
                return prev.map(m => (m.isTemp && m.content === latestMessage.content) ? latestMessage : m)
            }
            return [...prev, latestMessage]
        })
        setTimeout(scrollToBottom, 100)
    }, [latestMessage, conversationId])

    useEffect(() => {
        if (!conversationId) return

        setIsLoading(true)
        getDirectMessages(conversationId)
            .then(data => {
                setMessages(data || [])
                setIsLoading(false)
                setTimeout(scrollToBottom, 100)
            })
            .catch(console.error)
    }, [conversationId, currentUserId])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isSending) return

        const content = newMessage
        setNewMessage('')
        setIsSending(true)
        setTyping(null) // Stop typing on send

        // Optimistic update
        const tempMsg = {
            id: 'temp-' + Date.now(),
            content,
            sender_id: currentUserId,
            created_at: new Date().toISOString(),
            isTemp: true
        }
        setMessages(prev => [...prev, tempMsg])
        setTimeout(scrollToBottom, 50)

        try {
            await sendDirectMessage(conversationId, content)
            // Re-fetch to get cannonical IDs
            const data = await getDirectMessages(conversationId)
            setMessages(data || [])
        } catch (error) {
            console.error('Failed to send:', error)
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
        } finally {
            setIsSending(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setNewMessage(val)
        setTyping(val.length > 0 ? conversationId : null)
    }

    return (
        <div className="w-[360px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="h-14 px-4 bg-white border-b border-slate-50 flex items-center justify-between flex-none sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <img
                        src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                        alt={otherUser?.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-800 text-sm leading-none truncate max-w-[150px]">{otherUser?.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                            {isOtherUserTyping ? (
                                <span className="text-[10px] text-blue-500 font-bold uppercase animate-pulse leading-none">Escribiendo...</span>
                            ) : (
                                <>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isOtherUserOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    <span className="text-[10px] text-slate-400 font-bold leading-none">
                                        {isOtherUserOnline ? 'Online' : 'Offline'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onMinimizeAction} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-50 rounded-full transition-all">
                        <Minus size={18} />
                    </button>
                    <button onClick={onCloseAction} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cargando...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                        <div className="p-3 bg-slate-50 rounded-full">
                            <Send size={24} className="opacity-20 translate-x-0.5 -translate-y-0.5" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">No hay mensajes aún</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold mt-1 px-1">
                                    {format(new Date(msg.created_at), 'h:mm a')}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-50 flex-none">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <button className="text-slate-400 hover:text-blue-500">
                        <Paperclip size={18} />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 placeholder:font-medium py-1"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className={`p-1.5 rounded-lg bg-blue-600 text-white transition-all ${!newMessage.trim() || isSending ? 'opacity-50 grayscale' : 'hover:scale-105 active:scale-95 shadow-md shadow-blue-200'
                            }`}
                    >
                        <Send size={16} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    )
}
