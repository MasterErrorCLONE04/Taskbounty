'use client'

import React, { useState } from 'react'
import { openDispute } from '@/actions/disputes'
import { AlertTriangle, Loader2, Send } from 'lucide-react'
import FileUploader from './FileUploader'
import { submitEvidence } from '@/actions/evidence' // Added this import

interface DisputeFormProps {
    taskId: string
    onSuccess?: () => void
}

export default function DisputeForm({ taskId, onSuccess }: DisputeFormProps) {
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reason.trim() || loading) return

        if (!confirm('¿Estás seguro de que quieres abrir una disputa? Un mediador revisará el caso y su decisión será final.')) {
            return
        }

        setLoading(true)
        try {
            await openDispute(taskId, reason)
            setIsOpen(false)
            if (onSuccess) onSuccess()
        } catch (err: any) {
            alert(err.message || 'Error al abrir la disputa.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full h-12 border-2 border-destructive/30 text-destructive font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-destructive/5 transition-all"
            >
                <AlertTriangle className="w-4 h-4" />
                Abrir Disputa
            </button>
        )
    }

    return (
        <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <header className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold">Nueva Disputa</h3>
            </header>

            <p className="text-xs text-muted-foreground leading-relaxed">
                Describe detalladamente por qué estás abriendo esta disputa. Incluye pruebas o referencias a los mensajes del chat.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    required
                    placeholder="Razón de la disputa..."
                    className="w-full p-4 rounded-xl bg-background border border-destructive/20 text-sm focus:ring-2 focus:ring-destructive outline-none transition-all resize-none"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />

                <div className="bg-white/50 p-4 rounded-2xl border border-destructive/10">
                    <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-3">Adjuntar Evidencias (Opcional)</p>
                    <FileUploader
                        taskId={taskId}
                        purpose="evidence"
                        label="Subir captura o documento de prueba"
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

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 h-12 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !reason.trim()}
                        className="flex-[2] h-12 bg-destructive text-destructive-foreground font-black rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-destructive/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                Iniciar Proceso
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
