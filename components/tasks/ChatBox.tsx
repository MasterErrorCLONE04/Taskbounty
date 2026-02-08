'use client'

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
        <div className="flex flex-col h-[500px] bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" /> Sala de Chat
                </h3>
                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">En línea</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-grow p-6 overflow-y-auto space-y-4 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                        <User className="w-8 h-8 opacity-20" />
                        <p className="text-sm font-medium">No hay mensajes aún. ¡Saluda!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender_id === currentUserId
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-muted text-foreground rounded-tl-none'
                                }`}>
                                {msg.message}
                                <span className={`block text-[10px] mt-1 opacity-60 ${msg.sender_id === currentUserId ? 'text-right' : 'text-left'
                                    }`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-border bg-card">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="w-full h-12 pl-6 pr-14 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="absolute right-2 top-2 w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </form>
        </div>
    )
}
