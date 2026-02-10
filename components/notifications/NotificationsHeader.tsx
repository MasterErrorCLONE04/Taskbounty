
import { Settings } from 'lucide-react'

export function NotificationsHeader() {
    return (
        <div className="p-6 flex justify-between items-center bg-white border-b border-slate-50">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <div className="flex items-center gap-6">
                <button className="text-blue-500 text-[14px] font-bold hover:underline">Mark all as read</button>
                <button className="text-slate-600 hover:text-slate-900 transition-colors">
                    <Settings size={22} />
                </button>
            </div>
        </div>
    )
}
