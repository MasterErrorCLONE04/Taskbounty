import { useState, useEffect, useRef } from 'react'
import { Info, Paperclip, Banknote, Smile, Send, Maximize2, Minimize2 } from 'lucide-react'
import { getDirectMessages, sendDirectMessage } from '@/actions/messages'
import { format } from 'date-fns'
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
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const otherUser = conversation?.otherUser

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (!conversation?.id) return

        setIsLoading(true)
        getDirectMessages(conversation.id)
            .then(data => {
                setMessages(data || [])
                setIsLoading(false)
                setTimeout(scrollToBottom, 100)
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
                    // Avoid duplicate if we already added it optimistically (check by sender or some temp ID if we had one)
                    // Since optimistic message has ID start with 'temp-', we should replace it or ignore if it's the same content?
                    // Better approach: Just append if sender is NOT me. 
                    // If sender IS me, we theoretically already have it. 
                    // But to be safe and get the real ID, we could replace the temp one.

                    if (newMessage.sender_id !== currentUserId) {
                        setMessages(prev => [...prev, newMessage])
                        setTimeout(scrollToBottom, 100)
                    } else {
                        // Optional: Replace temp message with real one to get correct ID/timestamp
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
            // Re-fetch to get canonical ID and timestamp (or just rely on revalidate)
            // For now, we assume success
            const freshMessages = await getDirectMessages(conversation.id)
            setMessages(freshMessages || [])
        } catch (error) {
            console.error('Failed to send message:', error)
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id)) // Remove temp if failed
            alert('Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
            // Immediately stop typing indicator on send
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

    // No useEffect needed for timeout anymore

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
                        title={isFullWidth ? "Exit full width" : "Full width chat"}
                    >
                        {isFullWidth ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-10">
                        <span className="text-slate-400">Loading messages...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <p>No messages yet.</p>
                        <p className="text-sm">Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId
                        return (
                            <div key={msg.id} className={`flex flex-col gap-1 items-${isMe ? 'end ml-auto' : 'start'} max-w-lg`}>
                                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isMe
                                    ? 'bg-blue-500 text-white rounded-tr-none'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold mx-1 uppercase">
                                    {format(new Date(msg.created_at), 'h:mm a')}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 pt-0 flex-none">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <textarea
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Start a new message"
                        className="w-full bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 resize-none min-h-[60px] outline-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-4">
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Paperclip size={18} />
                            </button>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Banknote size={18} />
                            </button>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <Smile size={18} />
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
