'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ShieldCheck,
    DollarSign,
    Clock,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { createTaskWithEscrow } from '@/actions/tasks'

export default function TaskForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        bounty_amount: '',
        deadline: '',
        category: 'General'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Basic validation
            if (parseFloat(formData.bounty_amount) < 5) {
                throw new Error('El bounty mínimo es de $5.00')
            }

            const result = await createTaskWithEscrow({
                ...formData,
                bounty_amount: parseFloat(formData.bounty_amount),
                deadline: new Date(formData.deadline).toISOString()
            })

            // Normally here we would handle Stripe Elements confirmation
            // For this MVP step, we redirect to a payment page or simulate success
            // If we had the clientSecret, we'd use stripe.confirmCardPayment

            router.push(`/tasks/${result.taskId}/pay?secret=${result.clientSecret}`)
        } catch (err: any) {
            setError(err.message || 'Error al crear la tarea')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                <div className="space-y-2">
                    <label className="text-xl font-bold flex items-center gap-2" htmlFor="title">
                        ¿Qué necesitas hacer?
                    </label>
                    <input
                        id="title"
                        name="title"
                        required
                        placeholder="Ej: Implementar Webhook de Stripe en Next.js"
                        className="w-full h-14 px-6 rounded-2xl bg-background border border-border text-lg font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xl font-bold flex items-center gap-2" htmlFor="description">
                        Descripción detallada
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        placeholder="Explica detalladamente en qué consiste la tarea..."
                        className="w-full p-6 rounded-3xl bg-background border border-border text-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xl font-bold flex items-center gap-2" htmlFor="requirements">
                        Requisitos y entregables
                    </label>
                    <textarea
                        id="requirements"
                        name="requirements"
                        required
                        rows={4}
                        placeholder="Enumera lo que esperas recibir (ej: Repositorio de GitHub, Documentación)..."
                        className="w-full p-6 rounded-3xl bg-background border border-border text-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        value={formData.requirements}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-xl font-bold flex items-center gap-2">
                        Categoría de la tarea
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {['Diseño', 'Código', 'Content', 'Video', 'General'].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat })}
                                className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${formData.category === cat
                                        ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200 hover:text-sky-500'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm">
                    <label className="text-xl font-bold flex items-center gap-2" htmlFor="bounty_amount">
                        <DollarSign className="w-6 h-6 text-primary" /> Bounty Ofrecido
                    </label>
                    <div className="relative">
                        <span className="absolute left-6 top-4 text-2xl font-bold text-muted-foreground">$</span>
                        <input
                            id="bounty_amount"
                            name="bounty_amount"
                            type="number"
                            required
                            min="5"
                            step="0.01"
                            placeholder="150.00"
                            className="w-full h-16 pl-12 pr-6 rounded-2xl bg-background border border-border text-2xl font-black focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.bounty_amount}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Este monto será retenido en escrow y liberado solo cuando apruebes la entrega.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm">
                    <label className="text-xl font-bold flex items-center gap-2" htmlFor="deadline">
                        <Clock className="w-6 h-6 text-primary" /> Fecha Límite
                    </label>
                    <input
                        id="deadline"
                        name="deadline"
                        type="datetime-local"
                        required
                        className="w-full h-16 px-6 rounded-2xl bg-background border border-border text-lg font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Deadline para que el trabajador entregue el resultado final.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">Protección Escrow</h4>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Al publicar, depositarás el bounty en una cuenta segura. Si el trabajador no cumple, recuperas tu dinero.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-5 bg-primary text-primary-foreground text-xl font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                            Confirmar y pagar
                            <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
