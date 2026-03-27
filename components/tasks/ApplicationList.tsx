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
                    className={`bg-white border rounded-2xl p-6 transition-all ${app.status === 'accepted'
                        ? 'border-2 border-[#0ea5e9]'
                        : 'border-slate-200'
                        }`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f0f9ff] flex items-center justify-center text-[#0ea5e9] overflow-hidden">
                                {app.worker?.avatar_url ? (
                                    <img
                                        src={app.worker.avatar_url}
                                        alt={app.worker.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={24} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-[16px] leading-tight">
                                    {app.worker?.name || 'Trabajador'}
                                </h4>
                                <div className="flex items-center gap-1.5 text-orange-500 mt-1">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-[13px] font-bold">{app.worker?.rating || '0.0'}</span>
                                </div>
                            </div>
                        </div>

                        {app.status === 'pending' && !isDisabled ? (
                            <button
                                onClick={() => handleAssignClick(app)}
                                className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-[0.98]"
                            >
                                Asignar tarea
                                <CheckCircle2 size={16} />
                            </button>
                        ) : app.status === 'accepted' ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-[#0ea5e9] text-white px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
                                    <Trophy size={12} />
                                    Seleccionado
                                </div>
                                <div className="bg-[#f0f9ff] text-[#0ea5e9] px-4 py-2.5 rounded-xl font-bold text-[13px]">
                                    Aceptado
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <p className="text-slate-500 font-medium italic text-[14px] leading-relaxed mb-6 ml-1">
                        "{app.proposal_text}"
                    </p>

                    <div className="flex items-center gap-1.5 text-[#0ea5e9] font-bold text-[11px] uppercase tracking-wider ml-1">
                        <Clock size={14} />
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
