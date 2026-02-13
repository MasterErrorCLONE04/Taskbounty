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
import AssignmentModal from './AssignmentModal'

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
        avatar_url?: string
    }
}

export default function ApplicationList({
    applications,
    taskId,
    isDisabled,
    bountyAmount,
    deadline
}: {
    applications: Application[],
    taskId: string,
    isDisabled: boolean,
    bountyAmount: number,
    deadline: string
}) {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)

    const handleAssignClick = (app: Application) => {
        setSelectedApp(app)
    }

    const confirmAssignment = async () => {
        if (!selectedApp) return

        setLoadingId(selectedApp.id)
        try {
            await acceptApplication(taskId, selectedApp.id, selectedApp.worker_id)
            setSelectedApp(null) // Close modal on success (page will reload due to server action)
        } catch (err: any) {
            alert(err.message || 'Error al aceptar la aplicación.')
            setLoadingId(null) // Only reset loading if error, otherwise wait for redirect/refresh
        }
    }

    if (applications.length === 0) {
        return (
            <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center text-slate-400 font-bold">
                Todavía no has recibido ninguna aplicación para esta tarea.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => (
                <div
                    key={app.id}
                    className={`bg-white border rounded-[2rem] p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 ${app.status === 'accepted'
                        ? 'border-blue-500 ring-4 ring-blue-500/10'
                        : 'border-slate-100'
                        }`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-400 overflow-hidden border border-blue-100">
                                {app.worker?.avatar_url ? (
                                    <img
                                        src={app.worker.avatar_url}
                                        alt={app.worker.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={28} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-lg leading-tight">
                                    {app.worker?.name || 'Trabajador'}
                                </h4>
                                <div className="flex items-center gap-1.5 text-orange-400 mt-1">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-sm font-black">{app.worker?.rating || '0.0'}</span>
                                    {app.status === 'accepted' && (
                                        <span className="ml-2 bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                            Aceptado
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {app.status === 'pending' && !isDisabled ? (
                            <button
                                onClick={() => handleAssignClick(app)}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                Asignar tarea
                                <CheckCircle2 size={18} />
                            </button>
                        ) : app.status === 'accepted' ? (
                            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-2xl font-black text-sm border border-green-100">
                                <Trophy size={18} />
                                Seleccionado
                            </div>
                        ) : (
                            <div className="bg-slate-50 text-slate-400 px-6 py-3 rounded-2xl font-black text-sm border border-slate-100 opacity-50">
                                No seleccionado
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50/50 rounded-2xl p-5 mb-6 border border-slate-50">
                        <p className="text-slate-600 font-medium italic leading-relaxed">
                            "{app.proposal_text}"
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-blue-500 font-black text-[11px] uppercase tracking-wider ml-1">
                        <Clock size={16} />
                        <span>Entrega en: {app.estimated_time}</span>
                    </div>
                </div>
            ))}

            <AssignmentModal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                onConfirm={confirmAssignment}
                candidateName={selectedApp?.worker?.name || 'Candidate'}
                bountyAmount={bountyAmount}
                deadline={deadline}
                isProcessing={!!loadingId}
            />
        </div>
    )
}
