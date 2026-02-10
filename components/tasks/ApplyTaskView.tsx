"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    ShieldCheck,
    Send,
    Clock,
    Loader2,
    AlertCircle,
    FileText
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { submitApplication } from '@/actions/applications'

export function ApplyTaskView({ taskId }: { taskId: string }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [task, setTask] = useState<any>(null)
    const [formData, setFormData] = useState({
        proposal_text: '',
        estimated_time: ''
    })

    useEffect(() => {
        async function loadTask() {
            const { data, error: fetchError } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single()

            if (fetchError) {
                setError('No pudimos cargar la tarea.')
            } else {
                setTask(data)
            }
            setFetching(false)
        }
        loadTask()
    }, [taskId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await submitApplication(taskId, formData)
            router.push(`/tasks/${taskId}?applied=true`)
        } catch (err: any) {
            setError(err.message || 'Error al enviar la aplicación.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        )
    }

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Tarea no encontrada</h1>
                <Link href="/tasks/explore" className="text-primary hover:underline">Volver al explorador</Link>
            </div>
        )
    }

    return (
        <div className="pb-20">
            <nav className="p-6 border-b border-border/40 bg-card mb-12">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href={`/tasks/${taskId}`} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver a la tarea
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm">Postulación Segura</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6">
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        Aplicando a
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">
                        {task.title}
                    </h1>
                    <div className="flex items-center gap-4 text-xl font-bold">
                        <span className="text-muted-foreground font-medium">Bounty:</span>
                        <span className="text-primary">${task.bounty_amount} USD</span>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                        <div className="space-y-4">
                            <label className="text-xl font-bold flex items-center gap-2" htmlFor="proposal_text">
                                <FileText className="w-5 h-5 text-primary" /> Tu Propuesta
                            </label>
                            <textarea
                                id="proposal_text"
                                name="proposal_text"
                                required
                                rows={6}
                                placeholder="Explica por qué eres el mejor candidato y cómo planeas realizar esta tarea..."
                                className="w-full p-6 rounded-2xl bg-background border border-border text-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                value={formData.proposal_text}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xl font-bold flex items-center gap-2" htmlFor="estimated_time">
                                <Clock className="w-5 h-5 text-primary" /> Tiempo Estimado
                            </label>
                            <input
                                id="estimated_time"
                                name="estimated_time"
                                required
                                placeholder="Ej: 2 días, 5 horas, etc."
                                className="w-full h-14 px-6 rounded-2xl bg-background border border-border text-lg font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={formData.estimated_time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-10 py-5 bg-primary text-primary-foreground text-xl font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Enviar propuesta
                                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                        <p className="text-sm text-muted-foreground text-center md:text-left leading-relaxed max-w-xs font-medium">
                            Tu propuesta será enviada al cliente. Solo puedes aplicar una vez a esta tarea.
                        </p>
                    </div>
                </form>
            </main>
        </div>
    )
}
