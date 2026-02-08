'use client'

import React from 'react'
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react'

interface DisputeInfoProps {
    dispute: {
        reason: string
        status: string
        created_at: string
    }
}

export default function DisputeInfo({ dispute }: DisputeInfoProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="bg-destructive/10 border border-destructive/30 rounded-3xl p-8 space-y-6">
            <header className="flex items-center gap-3 text-destructive">
                <div className="p-3 bg-destructive/10 rounded-2xl">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Tarea en Disputa</h3>
                    <p className="text-sm opacity-80 font-medium">Un mediador está revisando este caso.</p>
                </div>
            </header>

            <div className="bg-background/50 rounded-2xl p-6 border border-destructive/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    Motivo de la disputa
                </div>
                <p className="text-sm leading-relaxed italic text-foreground">
                    "{dispute.reason}"
                </p>
                <div className="pt-4 flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                    <Clock className="w-3 h-3" />
                    Abierta el {mounted ? new Date(dispute.created_at).toLocaleDateString() : '...'} a las {mounted ? new Date(dispute.created_at).toLocaleTimeString() : '...'}
                </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                <p className="text-xs text-muted-foreground text-center font-medium">
                    Mientras la disputa esté abierta, las acciones de aprobación y entrega están bloqueadas. El chat sigue disponible para llegar a un acuerdo amistoso.
                </p>
            </div>
        </div>
    )
}
