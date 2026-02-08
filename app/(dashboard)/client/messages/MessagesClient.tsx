'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    Search,
    MoreHorizontal,
    Send,
    Loader2,
    User,
    CheckCheck,
    Phone,
    Video,
    Info,
    ArrowLeft
} from 'lucide-react';
import { sendMessage } from '@/actions/messages';
import Link from 'next/link';

interface Message {
    id: string;
    message: string;
    sender_id: string;
    created_at: string;
}

export default function MessagesClient({ user, initialTasks, selectedTaskId }: any) {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTaskId, setActiveTaskId] = useState(selectedTaskId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeTask = tasks.find((t: any) => t.id === activeTaskId);
    const otherParticipant = activeTask
        ? (activeTask.client.id === user.id ? activeTask.worker : activeTask.client)
        : null;

    useEffect(() => {
        if (!activeTaskId) return;

        // Load initial messages for selected task
        async function loadMessages() {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('task_id', activeTaskId)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
        }
        loadMessages();

        // Subscribe to real-time changes
        const channel = supabase
            .channel(`task:${activeTaskId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `task_id=eq.${activeTaskId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new as Message]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeTaskId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || loading || !activeTaskId) return;

        setLoading(true);
        try {
            await sendMessage(activeTaskId, newMessage);
            setNewMessage('');
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {/* Conversations Sidebar */}
            <aside className="w-96 bg-white border-r border-slate-100 flex flex-col h-full z-10">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Mensajes</h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Buscar chats..."
                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-sky-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto mt-4">
                    {tasks.map((task: any) => {
                        const contact = task.client.id === user.id ? task.worker : task.client;
                        const isActive = activeTaskId === task.id;
                        return (
                            <button
                                key={task.id}
                                onClick={() => setActiveTaskId(task.id)}
                                className={`w-full p-6 flex items-center gap-4 transition-all hover:bg-slate-50 border-l-4 ${isActive ? 'bg-sky-50/50 border-sky-500' : 'border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm border-2 border-white shadow-sm overflow-hidden">
                                        {contact.avatar_url ? (
                                            <img src={contact.avatar_url} alt={contact.name} className="w-full h-full object-cover" />
                                        ) : contact.name[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-black text-slate-900">{contact.name}</p>
                                        <span className="text-[10px] font-bold text-slate-300">12:45</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 truncate mb-1">{task.title}</p>
                                    <p className="text-xs font-medium text-slate-400 truncate">Haciendo clic para ver el chat...</p>
                                </div>
                                {isActive && (
                                    <div className="w-2 h-2 bg-sky-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full relative bg-white lg:bg-slate-50/30">
                {activeTask ? (
                    <>
                        {/* Chat Header */}
                        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-10">
                            <div className="flex items-center gap-4">
                                <Link href="/client/messages" className="lg:hidden p-2 text-slate-400">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs border-2 border-white shadow-sm overflow-hidden">
                                    {otherParticipant?.avatar_url ? (
                                        <img src={otherParticipant.avatar_url} alt={otherParticipant.name} className="w-full h-full object-cover" />
                                    ) : otherParticipant?.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm">{otherParticipant?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En línea</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                                    <Video className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                                    <Info className="w-4 h-4" />
                                </button>
                            </div>
                        </header>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
                        >
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="font-black text-sm uppercase tracking-widest">No hay mensajes aún</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.sender_id === user.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 mr-4 mt-auto mb-2 flex items-center justify-center text-[10px] font-black text-slate-400 overflow-hidden shrink-0">
                                                    {otherParticipant?.avatar_url ? (
                                                        <img src={otherParticipant.avatar_url} className="w-full h-full object-cover" />
                                                    ) : otherParticipant?.name[0]}
                                                </div>
                                            )}
                                            <div className="max-w-[70%]">
                                                <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${isMe
                                                        ? 'bg-sky-500 text-white rounded-br-none shadow-sky-200'
                                                        : 'bg-white text-slate-600 rounded-bl-none border border-slate-50'
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                                <div className={`flex items-center gap-2 mt-2 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <CheckCheck className="w-3 h-3 text-sky-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 px-10 bg-white lg:bg-transparent">
                            <form
                                onSubmit={handleSend}
                                className="relative bg-white border border-slate-100 p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center pr-4"
                            >
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje aquí..."
                                    className="flex-1 h-14 pl-8 pr-4 bg-transparent border-none outline-none text-sm font-medium text-slate-700"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/30 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                        <MessageSquare className="w-20 h-20 mb-6 opacity-10" />
                        <h3 className="text-xl font-black text-slate-400 mb-2">Selecciona una conversación</h3>
                        <p className="text-sm font-medium text-slate-300">Elige un chat de la lista lateral para empezar a hablar.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function MessageSquare({ className, ...props }: any) {
    return (
        <svg
            {...props}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
