'use client'

import React, { useState } from 'react'
import { forceActivateTask } from '@/actions/dev'
import { Loader2, Zap, AlertCircle } from 'lucide-react'

export default function DevActivationButton({ taskId }: { taskId: string }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleActivate = async () => {
        if (!confirm('¿Quieres activar esta tarea manualmente? (Solo para Desarrollo)')) return

        setLoading(true)
        setError(null)
        try {
            await forceActivateTask(taskId)
            // Page will revalidate via server action
        } catch (err: any) {
            setError(err.message || 'Error al activar la tarea.')
        } finally {
            setLoading(false)
        }
    }

    if (process.env.NODE_ENV !== 'development') return null

    return (
        <div className="space-y-4">
            <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500/20 transition-all group"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        <Zap className="w-5 h-5 fill-yellow-500" />
                        Forzar Activación (DEV)
                    </>
                )}
            </button>
            {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
            <p className="text-[10px] text-muted-foreground text-center">
                Usa este botón si no tienes el Stripe CLI configurado para recibir webhooks.
            </p>
        </div>
    )
}
