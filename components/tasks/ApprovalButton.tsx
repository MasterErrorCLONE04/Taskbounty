'use client'

import React, { useState } from 'react'
import { approveAndRelease } from '@/actions/closure'
import { ShieldCheck, Loader2 } from 'lucide-react'

export default function ApprovalButton({ taskId }: { taskId: string }) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        if (!confirm('¿Estás seguro de que quieres aprobar esta entrega? El dinero será liberado inmediatamente al trabajador y esta acción no se puede deshacer.')) {
            return
        }

        setLoading(true)
        try {
            await approveAndRelease(taskId)
        } catch (err: any) {
            alert(err.message || 'Error al aprobar la entrega.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleApprove}
            disabled={loading}
            className="w-full h-14 bg-primary text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    Aprobar Entrega & Pagar
                    <ShieldCheck className="w-5 h-5" />
                </>
            )}
        </button>
    )
}
