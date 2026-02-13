import React from 'react'
import {
    Plus,
    Banknote,
    UserPlus,
    History,
    CheckCircle2,
    ShieldCheck,
    Briefcase
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export interface ActivityEvent {
    id: string
    type: 'creation' | 'escrow' | 'applicant' | 'assignment' | 'completion' | 'status_change' | 'delivery'
    title: string
    time: string
    date: Date
    icon?: React.ReactNode
    bgColor?: string
    iconColor?: string
}

interface ActivityHistoryProps {
    activities: ActivityEvent[]
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
    const getIconInfo = (type: ActivityEvent['type']) => {
        switch (type) {
            case 'creation':
                return { icon: <Plus size={16} />, bgColor: 'bg-blue-50', iconColor: 'text-blue-500' }
            case 'escrow':
                return { icon: <Banknote size={16} />, bgColor: 'bg-green-50', iconColor: 'text-green-500' }
            case 'applicant':
                return { icon: <UserPlus size={16} />, bgColor: 'bg-blue-50', iconColor: 'text-blue-500' }
            case 'assignment':
                return { icon: <CheckCircle2 size={16} />, bgColor: 'bg-purple-50', iconColor: 'text-purple-500' }
            case 'delivery':
                return { icon: <Briefcase size={16} />, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500' }
            case 'completion':
                return { icon: <ShieldCheck size={16} />, bgColor: 'bg-orange-50', iconColor: 'text-orange-500' }
            default:
                return { icon: <Plus size={16} />, bgColor: 'bg-slate-50', iconColor: 'text-slate-500' }
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <History size={22} className="text-blue-500" />
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Historial de Actividad</h2>
                </div>
            </div>

            <div className="relative pl-4 space-y-12">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                {activities.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 font-bold">
                        No hay actividad registrada aún.
                    </div>
                ) : (
                    activities.map((activity) => {
                        const style = getIconInfo(activity.type)
                        return (
                            <div key={activity.id} className="relative flex items-center gap-6 group">
                                <div className={`z-10 w-10 h-10 rounded-full ${style.bgColor} flex items-center justify-center ${style.iconColor} border-4 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110`}>
                                    {style.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 leading-none mb-1.5">{activity.title}</span>
                                    <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">
                                        {activity.time}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default ActivityHistory
