'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Minus, Send, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { getDirectMessages, sendDirectMessage } from '@/actions/messages'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
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
    const [sendError, setSendError] = useState<string | null>(null)
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const { onlineUsers, typingUsers, setTyping } = useGlobalPresence()
    const isOtherUserOnline = otherUser?.id && onlineUsers.has(otherUser.id)
    const isOtherUserTyping = otherUser?.id && typingUsers.get(otherUser.id) === conversationId

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior })
    }

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current
        if (!container) return
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
        setShowScrollBtn(distanceFromBottom > 100)
    }, [])

    // React to new messages from parent
    useEffect(() => {
        if (!latestMessage) return
        if (latestMessage.conversation_id !== conversationId) return

        setMessages(prev => {
            const exists = prev.some(m => m.id === latestMessage.id || (m.isTemp && m.content === latestMessage.content))
            if (exists) {
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
                setTimeout(() => scrollToBottom('instant'), 100)
            })
            .catch(console.error)
    }, [conversationId, currentUserId])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isSending) return
        setSendError(null)

        const content = newMessage
        setNewMessage('')
        setIsSending(true)
        setTyping(null)

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }

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
            const data = await getDirectMessages(conversationId)
            setMessages(data || [])
        } catch (error) {
            console.error('Failed to send:', error)
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
            setSendError('Error al enviar')
            setTimeout(() => setSendError(null), 3000)
        } finally {
            setIsSending(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setNewMessage(val)
        setTyping(val.length > 0 ? conversationId : null)

        // Auto-resize
        const target = e.target
        target.style.height = 'auto'
        target.style.height = Math.min(target.scrollHeight, 80) + 'px'
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr)
        if (isToday(date)) return 'Hoy'
        if (isYesterday(date)) return 'Ayer'
        return format(date, "d MMM yyyy", { locale: es })
    }

    const shouldShowDateSeparator = (currentMsg: any, prevMsg: any) => {
        if (!prevMsg) return true
        return !isSameDay(new Date(currentMsg.created_at), new Date(prevMsg.created_at))
    }

    return (
        <div className="w-[328px] h-[455px] bg-white rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
            style={{ borderRadius: '8px 8px 0 0' }}>

            {/* ── Header ── */}
            <div className="h-[50px] px-3 bg-white border-b border-slate-100 flex items-center justify-between flex-none">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:bg-slate-50 rounded-lg p-1 -ml-1 transition-colors">
                    <div className="relative flex-shrink-0">
                        <img
                            src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                            alt={otherUser?.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isOtherUserOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 text-[13px] leading-tight truncate">{otherUser?.name}</h3>
                        {isOtherUserTyping ? (
                            <p className="text-[10px] text-blue-500 font-medium animate-pulse leading-tight">Escribiendo...</p>
                        ) : (
                            <p className="text-[10px] text-slate-400 font-medium leading-tight">
                                {isOtherUserOnline ? 'Activo ahora' : 'Offline'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center">
                    <button onClick={onMinimizeAction} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                        <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <button onClick={onCloseAction} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* ── Messages ── */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 bg-white relative"
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[11px] text-slate-400">Cargando...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="relative">
                            <img
                                src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                                alt={otherUser?.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-white ${isOtherUserOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-slate-700 text-sm">{otherUser?.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Envía un mensaje para iniciar</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId
                        const prevMsg = index > 0 ? messages[index - 1] : null
                        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null
                        const showDate = shouldShowDateSeparator(msg, prevMsg)

                        // Grouping logic: consecutive messages from same sender get tighter spacing
                        const prevSameSender = prevMsg?.sender_id === msg.sender_id && !showDate
                        const nextSameSender = nextMsg?.sender_id === msg.sender_id &&
                            nextMsg && isSameDay(new Date(msg.created_at), new Date(nextMsg.created_at))

                        // Show avatar only on last message of a group
                        const showAvatar = !isMe && !nextSameSender

                        return (
                            <div key={msg.id}>
                                {showDate && (
                                    <div className="flex justify-center my-3">
                                        <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
                                            {getDateLabel(msg.created_at)}
                                        </span>
                                    </div>
                                )}

                                <div className={`flex items-end gap-1.5 animate-[fadeIn_0.15s_ease-out] ${isMe ? 'flex-row-reverse' : 'flex-row'} ${prevSameSender ? 'mt-0.5' : 'mt-2'}`}>
                                    {/* Avatar slot */}
                                    {!isMe ? (
                                        showAvatar ? (
                                            <img
                                                src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                                                alt=""
                                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : <div className="w-6 flex-shrink-0" />
                                    ) : null}

                                    <div className={`max-w-[75%] ${isMe ? 'ml-auto' : ''}`}>
                                        <div className={`px-3 py-2 text-[13px] leading-[1.4] whitespace-pre-wrap ${isMe
                                            ? `bg-blue-500 text-white ${!prevSameSender ? 'rounded-[18px] rounded-br-[4px]' : nextSameSender ? 'rounded-[18px] rounded-r-[4px]' : 'rounded-[18px] rounded-tr-[4px]'}`
                                            : `bg-slate-100 text-slate-800 ${!prevSameSender ? 'rounded-[18px] rounded-bl-[4px]' : nextSameSender ? 'rounded-[18px] rounded-l-[4px]' : 'rounded-[18px] rounded-tl-[4px]'}`
                                            }`}>
                                            {msg.content}
                                        </div>
                                        {/* Show time only on last message of group */}
                                        {!nextSameSender && (
                                            <p className={`text-[9px] text-slate-400 mt-0.5 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                                                {format(new Date(msg.created_at), 'h:mm a')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}

                {/* Typing indicator */}
                {isOtherUserTyping && (
                    <div className="flex items-end gap-1.5 mt-2">
                        <img
                            src={otherUser?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="bg-slate-100 rounded-[18px] rounded-bl-[4px] px-4 py-2.5 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />

                {showScrollBtn && (
                    <button
                        onClick={() => scrollToBottom()}
                        className="sticky bottom-1 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-slate-500 shadow-md border border-slate-200 rounded-full p-1 hover:bg-white transition-all z-10"
                    >
                        <ChevronDown size={14} />
                    </button>
                )}
            </div>

            {/* Error */}
            {sendError && (
                <div className="mx-3 mb-1 py-1.5 px-3 bg-red-50 text-red-500 text-[10px] font-medium rounded-lg animate-[fadeIn_0.2s_ease-out]">
                    {sendError}
                </div>
            )}

            {/* ── Input ── */}
            <div className="px-3 py-2 bg-white border-t border-slate-50 flex-none">
                <div className="flex items-end gap-2">
                    <div className="flex-1 bg-slate-100 rounded-[20px] px-3 py-1.5 focus-within:bg-slate-50 focus-within:ring-1 focus-within:ring-blue-200 transition-all">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Aa"
                            rows={1}
                            className="w-full bg-transparent border-none outline-none text-[13px] text-slate-800 placeholder:text-slate-400 resize-none min-h-[24px] max-h-[80px] leading-[1.4]"
                            style={{ height: 'auto', overflow: 'hidden' }}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className={`p-2 rounded-full transition-all flex-shrink-0 ${!newMessage.trim() || isSending
                            ? 'text-slate-300'
                            : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50 active:scale-90'
                            }`}
                    >
                        <Send size={18} fill={newMessage.trim() ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
        </div>
    )
}
