"use client"

import { Lock } from "lucide-react"
import Link from 'next/link'

export interface TaskItemProps {
    id: string
    taskId: string
    status: string // Relaxed to string to accept DB statuses
    title: string
    personType: 'Client' | 'Hunter'
    personName: string
    personAvatar: string
    amount: number
    currency: string
    escrowActive: boolean
    actions: string[]
}

export function TaskCard({ task }: { task: TaskItemProps }) {
    // Helper for status colors
    const getStatusColor = (status: string) => {
        const s = status.toUpperCase();
        if (['IN PROGRESS', 'IN_PROGRESS', 'ASSIGNED'].includes(s)) return 'bg-yellow-100 text-yellow-700';
        if (['REVIEWING', 'SUBMITTED'].includes(s)) return 'bg-blue-100 text-blue-700';
        if (['DISPUTED'].includes(s)) return 'bg-rose-100 text-rose-700';
        return 'bg-green-100 text-green-700'; // COMPLETED, ESCROW ACTIVE, etc.
    }

    return (
        <Link href={`/tasks/${task.id}`} className="block p-6 border-b border-slate-50 hover:bg-slate-50/30 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        ID: {task.taskId}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-slate-900 leading-none">
                        ${task.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] font-bold text-slate-500 uppercase ml-0.5">{task.currency}</span>
                    </p>
                    {task.escrowActive && (
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <Lock size={10} className="text-green-600" />
                            <span className="text-[9px] font-black uppercase text-green-600 tracking-wider">Escrow Active</span>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-500 transition-colors">
                {task.title}
            </h3>

            <div className="flex items-center gap-2 mb-6">
                <img src={task.personAvatar || `https://ui-avatars.com/api/?name=${task.personName}&background=random`} alt={task.personName} className="w-6 h-6 rounded-full object-cover shadow-sm bg-slate-200" />
                <p className="text-[13px]">
                    <span className="text-slate-500 font-medium">{task.personType}:</span> <span className="font-bold text-slate-900 ml-1">{task.personName}</span>
                </p>
            </div>

            <div className="flex gap-3">
                {task.actions.map((action, idx) => (
                    <button
                        key={idx}
                        className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all ${idx === 0
                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        {action}
                    </button>
                ))}
            </div>
        </Link>
    )
}
