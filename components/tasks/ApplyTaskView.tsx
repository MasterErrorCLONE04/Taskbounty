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
    FileText,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { submitApplication } from '@/actions/applications'

export function ApplyTaskView({ taskId }: { taskId: string }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)
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
            setSuccess(true)
            // router.push(`/tasks/${taskId}?applied=true`) // Removed redirect
        } catch (err: any) {
            setError(err.message || 'Error al enviar la aplicación.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Tarea no encontrada</h1>
                <Link href="/tasks/explore" className="text-blue-500 hover:underline">Volver al explorador</Link>
            </div>
        )
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center pt-20 px-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-4 text-center tracking-tight">
                    ¡Propuesta enviada con éxito!
                </h1>

                <p className="text-slate-500 text-center max-w-md text-lg leading-relaxed mb-12">
                    Tu propuesta para <span className="font-bold text-slate-900">"{task.title}"</span> ha sido entregada correctamente. Te notificaremos cuando el cliente la revise.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Link
                        href="/my-applications"
                        className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl text-center transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        Ver mis aplicaciones
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-4 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-bold rounded-2xl text-center transition-all active:scale-95"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-20 bg-white min-h-full">
            {/* Header Navigation */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <Link href={`/tasks/${taskId}`} className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-slate-900 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a la tarea
                </Link>
                <div className="flex items-center gap-1.5 text-blue-500">
                    <ShieldCheck className="w-4 h-4 fill-blue-500 text-white" />
                    <span className="font-extrabold text-[11px] uppercase tracking-wide">Postulación Segura</span>
                </div>
            </div>

            <main className="px-6 pt-8">
                {/* Title Section */}
                <div className="text-center mb-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
                        APLICANDO A
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        {task.title}
                    </h1>
                    <div className="flex items-center justify-center gap-1 font-bold">
                        <span className="text-slate-900">Bounty:</span>
                        <span className="text-blue-500">${task.bounty_amount} USD</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Form Card */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 space-y-8">
                        {/* Proposal Input */}
                        <div className="space-y-4">
                            <label className="text-lg font-black text-slate-900 flex items-center gap-2" htmlFor="proposal_text">
                                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500">
                                    <FileText className="w-4 h-4" />
                                </div>
                                Tu Propuesta
                            </label>
                            <textarea
                                id="proposal_text"
                                name="proposal_text"
                                required
                                rows={6}
                                placeholder="Explica por qué eres el mejor candidato y cómo planeas realizar esta tarea..."
                                className="w-full p-4 rounded-2xl bg-white border border-slate-100 text-[15px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-300 font-medium text-slate-700"
                                value={formData.proposal_text}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Time Input */}
                        <div className="space-y-4">
                            <label className="text-lg font-black text-slate-900 flex items-center gap-2" htmlFor="estimated_time">
                                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500">
                                    <Clock className="w-4 h-4" />
                                </div>
                                Tiempo Estimado
                            </label>
                            <input
                                id="estimated_time"
                                name="estimated_time"
                                required
                                placeholder="Ej: 2 días, 5 horas, etc."
                                className="w-full h-14 px-4 rounded-2xl bg-white border border-slate-100 text-[15px] font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                                value={formData.estimated_time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-500 text-sm font-bold rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit Section */}
                    <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-10 py-4 bg-blue-500 text-white text-lg font-black rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 group active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Enviar propuesta
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs font-medium text-center md:text-left">
                            Tu propuesta será enviada al cliente. Solo puedes aplicar una vez a esta tarea.
                        </p>
                    </div>
                </form>
            </main>
        </div>
    )
}
