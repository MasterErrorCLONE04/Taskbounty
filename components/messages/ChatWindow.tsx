'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Info, Paperclip, Send, Maximize2, Minimize2, ChevronDown } from 'lucide-react'
import { getDirectMessages, sendDirectMessage } from '@/actions/messages'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '@/lib/supabase/client'

interface ChatWindowProps {
    conversation: any
    currentUserId?: string
    isOtherUserOnline?: boolean
    isOtherUserTyping?: boolean
    onTypingChange?: (isTyping: boolean) => void
    isFullWidth?: boolean
    onToggleFullWidth?: () => void
}

export function ChatWindow({
    conversation,
    currentUserId,
    isOtherUserOnline,
    isOtherUserTyping,
    onTypingChange,
    isFullWidth = false,
    onToggleFullWidth
}: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isTypingLocal, setIsTypingLocal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [sendError, setSendError] = useState<string | null>(null)
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    const otherUser = conversation?.otherUser

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior })
    }

    // Track scroll position — show "scroll to bottom" button
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current
        if (!container) return
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
        setShowScrollBtn(distanceFromBottom > 150)
    }, [])

    useEffect(() => {
        if (!conversation?.id) return

        setIsLoading(true)
        getDirectMessages(conversation.id)
            .then(data => {
                setMessages(data || [])
                setIsLoading(false)
                setTimeout(() => scrollToBottom('instant'), 100)
            })
            .catch(console.error)

        // Real-time Subscription
        const channel = supabase.channel(`direct_messages:${conversation.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'direct_messages',
                    filter: `conversation_id=eq.${conversation.id}`
                },
                (payload) => {
                    const newMessage = payload.new

                    if (newMessage.sender_id !== currentUserId) {
                        setMessages(prev => [...prev, newMessage])
                        setTimeout(scrollToBottom, 100)
                    } else {
                        setMessages(prev => prev.map(m =>
                            (m.isTemp && m.content === newMessage.content) ? newMessage : m
                        ))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversation.id, currentUserId])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !conversation?.id || isSending) return
        setSendError(null)

        const tempMessage = {
            id: `temp-${Date.now()}`,
            content: newMessage,
            originalContent: newMessage,
            sender_id: currentUserId,
            created_at: new Date().toISOString(),
            isTemp: true
        }

        setMessages(prev => [...prev, tempMessage])
        setNewMessage('')
        setIsSending(true)
        setTimeout(scrollToBottom, 50)

        try {
            await sendDirectMessage(conversation.id, tempMessage.originalContent)
            const freshMessages = await getDirectMessages(conversation.id)
            setMessages(freshMessages || [])
        } catch (error) {
            console.error('Failed to send message:', error)
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.')
            setTimeout(() => setSendError(null), 4000)
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
            if (isTypingLocal) {
                setIsTypingLocal(false)
                onTypingChange?.(false)
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setNewMessage(val)

        const isTyping = val.length > 0
        if (isTyping !== isTypingLocal) {
            setIsTypingLocal(isTyping)
            onTypingChange?.(isTyping)
        }
    }

    // Date separator helper
    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr)
        if (isToday(date)) return 'Hoy'
        if (isYesterday(date)) return 'Ayer'
        return format(date, "d 'de' MMMM, yyyy", { locale: es })
    }

    const shouldShowDateSeparator = (currentMsg: any, prevMsg: any) => {
        if (!prevMsg) return true
        return !isSameDay(new Date(currentMsg.created_at), new Date(prevMsg.created_at))
    }

    if (!conversation) return null

    return (
        <div className="flex-1 flex flex-col bg-white h-full">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-slate-50 flex items-center justify-between flex-none">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"}
                            alt={otherUser?.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isOtherUserOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 leading-none">{otherUser?.name}</h2>
                        {isOtherUserTyping ? (
                            <p className="text-[12px] text-blue-500 font-bold mt-1 animate-pulse">
                                Escribiendo...
                            </p>
                        ) : (
                            <p className={`text-[12px] font-medium mt-1 ${isOtherUserOnline ? 'text-green-500' : 'text-slate-400'}`}>
                                ● {isOtherUserOnline ? 'Online' : 'Offline'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onToggleFullWidth}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                        title={isFullWidth ? "Salir de pantalla completa" : "Pantalla completa"}
                    >
                        {isFullWidth ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Message Feed */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 space-y-1 relative"
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-slate-400 font-medium">Cargando mensajes...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <img
                            src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"}
                            alt={otherUser?.name}
                            className="w-16 h-16 rounded-full object-cover opacity-50"
                        />
                        <div className="text-center">
                            <p className="font-bold text-slate-500">Inicia la conversación</p>
                            <p className="text-sm text-slate-400 mt-1">Envía un mensaje a {otherUser?.name}</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId
                        const prevMsg = index > 0 ? messages[index - 1] : null
                        const showDate = shouldShowDateSeparator(msg, prevMsg)

                        return (
                            <div key={msg.id}>
                                {/* Date Separator */}
                                {showDate && (
                                    <div className="flex items-center gap-3 my-4">
                                        <div className="flex-1 h-px bg-slate-100"></div>
                                        <span className="text-[11px] text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-100">
                                            {getDateLabel(msg.created_at)}
                                        </span>
                                        <div className="flex-1 h-px bg-slate-100"></div>
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div className={`flex gap-2 items-end mb-3 animate-[fadeIn_0.2s_ease-out] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar for other user */}
                                    {!isMe ? (
                                        <img
                                            src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"}
                                            alt={otherUser?.name}
                                            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-4"
                                        />
                                    ) : <div className="w-7 flex-shrink-0" />}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-lg`}>
                                        <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap ${isMe
                                            ? 'bg-blue-500 text-white rounded-tr-none'
                                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium mt-1 mx-1">
                                            {format(new Date(msg.created_at), 'h:mm a')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />

                {/* Scroll to bottom button */}
                {showScrollBtn && (
                    <button
                        onClick={() => scrollToBottom()}
                        className="sticky bottom-2 left-1/2 -translate-x-1/2 bg-white text-slate-600 shadow-lg border border-slate-200 rounded-full p-2 hover:bg-slate-50 transition-all z-10 flex items-center gap-1 text-xs font-bold"
                    >
                        <ChevronDown size={16} />
                    </button>
                )}
            </div>

            {/* Send Error Toast */}
            {sendError && (
                <div className="mx-6 mb-2 p-3 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold rounded-xl flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                    <span>⚠️</span> {sendError}
                </div>
            )}

            {/* Input Area */}
            <div className="p-6 pt-0 flex-none">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <textarea
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe un mensaje..."
                        rows={1}
                        className="w-full bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 resize-none min-h-[40px] max-h-[120px] outline-none"
                        style={{ height: 'auto', overflow: 'hidden' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = 'auto'
                            target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                        }}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-4">
                            <button className="text-blue-500 hover:text-blue-600 transition-colors" title="Adjuntar archivo">
                                <Paperclip size={18} />
                            </button>
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending}
                            className={`p-2 transform transition-all ${!newMessage.trim() || isSending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                                }`}
                        >
                            <Send size={24} className="text-blue-500 fill-blue-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
