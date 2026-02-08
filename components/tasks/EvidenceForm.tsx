'use client'

import React, { useState } from 'react'
import {
    FileCheck,
    Link as LinkIcon,
    Send,
    Loader2,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'
import { submitEvidence } from '@/actions/evidence'
import FileUploader from './FileUploader'

export default function EvidenceForm({ taskId }: { taskId: string }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        evidence_text: '',
        links: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await submitEvidence(taskId, formData)
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Error al enviar la entrega.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">¡Entrega enviada!</h3>
                <p className="text-muted-foreground text-sm">
                    El cliente ha sido notificado y revisará tu trabajo pronto. El escrow se liberará una vez aprobado.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Entrega de Resultados</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest" htmlFor="evidence_text">
                        Descripción de lo realizado
                    </label>
                    <textarea
                        id="evidence_text"
                        name="evidence_text"
                        required
                        rows={4}
                        placeholder="Explica qué has completado y cualquier nota importante para el cliente..."
                        className="w-full p-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        value={formData.evidence_text}
                        onChange={(e) => setFormData({ ...formData, evidence_text: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2" htmlFor="links">
                        <LinkIcon className="w-4 h-4" /> Links relevantes (Repo, Vercel, etc.)
                    </label>
                    <input
                        id="links"
                        name="links"
                        placeholder="https://github.com/usuario/repo, https://demo.vercel.app"
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={formData.links}
                        onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Archivos de la entrega
                    </label>
                    <FileUploader
                        taskId={taskId}
                        purpose="deliverable"
                        label="Subir código, PDF o assets finales"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        Enviar para revisión
                        <Send className="w-5 h-5" />
                    </>
                )}
            </button>

            <p className="text-[10px] text-center text-muted-foreground font-medium">
                Al enviar, el estado de la tarea cambiará a "SUBMITTED" y el cliente podrá aprobar o solicitar cambios.
            </p>
        </form>
    )
}
