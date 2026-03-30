"use client"

import { Settings, Loader2 } from 'lucide-react'
import { markAllAsRead } from '@/actions/notifications'
import { useTransition } from 'react'

export function NotificationsHeader() {
    const [isPending, startTransition] = useTransition()

    const handleMarkAllAsRead = () => {
        startTransition(async () => {
            await markAllAsRead()
        })
    }

    return (
        <div className="p-6 flex justify-between items-center bg-white border-b border-slate-50">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <div className="flex items-center gap-6">
                <button 
                    onClick={handleMarkAllAsRead} 
                    disabled={isPending}
                    className="text-blue-500 text-[14px] font-bold hover:underline disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : 'Mark all as read'}
                </button>
                <button className="text-slate-600 hover:text-slate-900 transition-colors">
                    <Settings size={22} />
                </button>
            </div>
        </div>
    )
}
