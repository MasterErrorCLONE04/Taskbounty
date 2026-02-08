'use client'

import React, { useState } from 'react'
import {
    User,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Trophy,
    Star
} from 'lucide-react'
import { acceptApplication } from '@/actions/applications'

interface Application {
    id: string
    task_id: string
    worker_id: string
    proposal_text: string
    estimated_time: string
    status: string
    created_at: string
    worker?: {
        name: string
        rating: number
    }
}

export default function ApplicationList({
    applications,
    taskId,
    isDisabled
}: {
    applications: Application[],
    taskId: string,
    isDisabled: boolean
}) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleAccept = async (app: Application) => {
        if (!confirm(`¿Estás seguro de que quieres asignar esta tarea a ${app.worker?.name}?`)) return

        setLoadingId(app.id)
        try {
            await acceptApplication(taskId, app.id, app.worker_id)
            // Transition handled by server action revalidation
        } catch (err: any) {
            alert(err.message || 'Error al aceptar la aplicación.')
        } finally {
            setLoadingId(null)
        }
    }

    if (applications.length === 0) {
        return (
            <div className="bg-muted/30 border-2 border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground font-medium">
                Todavía no has recibido ninguna aplicación para esta tarea.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => (
                <div
                    key={app.id}
                    className={`bg-card border rounded-3xl p-8 transition-all hover:shadow-lg ${app.status === 'accepted' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        }`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-grow space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{app.worker?.name || 'Trabajador'}</h3>
                                    <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
                                        <Star className="w-4 h-4 fill-yellow-500" />
                                        {app.worker?.rating || '0.0'}
                                    </div>
                                </div>
                                {app.status === 'accepted' && (
                                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Trophy className="w-3 h-3" /> Seleccionado
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-muted/50 rounded-2xl">
                                <p className="text-muted-foreground italic leading-relaxed">
                                    "{app.proposal_text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Entrega en: {app.estimated_time}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {app.status === 'pending' && !isDisabled ? (
                                <button
                                    onClick={() => handleAccept(app)}
                                    disabled={!!loadingId}
                                    className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                >
                                    {loadingId === app.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Asignar tarea
                                            <CheckCircle2 className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            ) : app.status === 'accepted' ? (
                                <div className="w-full h-14 bg-primary/10 text-primary rounded-2xl font-black flex items-center justify-center gap-2 border border-primary/20">
                                    Aceptado
                                </div>
                            ) : (
                                <div className="w-full h-14 bg-muted text-muted-foreground rounded-2xl font-black flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                                    No seleccionado
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
