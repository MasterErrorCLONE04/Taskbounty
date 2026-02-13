"use client"

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Send, Loader2, User } from 'lucide-react'
import { sendMessage } from '@/actions/messages'

interface Message {
    id: string
    message: string
    sender_id: string
    created_at: string
}

export default function ChatBox({ taskId, currentUserId }: { taskId: string, currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // 1. Load initial messages
        async function loadMessages() {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('task_id', taskId)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
        }
        loadMessages()

        // 2. Subscribe to real-time changes
        const channel = supabase
            .channel(`task:${taskId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `task_id=eq.${taskId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new as Message])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [taskId])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || loading) return

        setLoading(true)
        try {
            await sendMessage(taskId, newMessage)
            setNewMessage('')
        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] relative">
            {/* Messages Area - Clean, dotted bg, no internal border */}
            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto space-y-6 scroll-smooth pr-4"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                        <User className="w-12 h-12 opacity-20" />
                        <p className="text-sm font-bold">La sala está lista. ¡Inicia la conversación!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.sender_id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${msg.sender_id === currentUserId
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-slate-100 text-slate-500'
                                }`}>
                                {msg.sender_id === currentUserId ? 'YO' : 'User'}
                            </div>

                            <div className={`max-w-[75%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender_id === currentUserId
                                ? 'bg-white border border-slate-100 text-slate-700 rounded-tr-none'
                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                }`}>
                                <p>{msg.message}</p>
                                <span className="block text-[10px] font-bold text-slate-300 mt-2">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area - Distinct separate block at bottom */}
            <div className="mt-4">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        placeholder="Escribe un mensaje de feedback..."
                        className="w-full h-14 pl-6 pr-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="absolute right-2 top-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-300 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    )
}
