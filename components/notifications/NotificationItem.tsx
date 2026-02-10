
import { CheckCircle2, CreditCard, Star, Megaphone } from 'lucide-react'

export interface Notification {
    id: number
    type: string
    user?: { name: string; avatar: string }
    content: string
    quote?: string
    time: string
    unread?: boolean
    hasActions?: boolean
    icon?: React.ReactNode
    iconBg?: string
}

export function NotificationItem({ notif }: { notif: Notification }) {
    return (
        <div className={`p-6 border-b border-slate-50 transition-all hover:bg-slate-50/50 flex gap-4 ${notif.unread ? 'bg-blue-50/20' : 'bg-white'}`}>
            {/* Avatar or Icon Area */}
            <div className="relative shrink-0">
                {notif.user ? (
                    <img src={notif.user.avatar} className="w-12 h-12 rounded-full object-cover" alt={notif.user.name} />
                ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notif.iconBg || 'bg-slate-100'}`}>
                        {notif.icon}
                    </div>
                )}
                {notif.icon && notif.user && (
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${notif.iconBg}`}>
                        {notif.icon}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[15px] text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: notif.content }} />
                        <span className="text-[13px] text-slate-400 font-medium">{notif.time}</span>

                        {notif.hasActions && (
                            <div className="flex gap-3 mt-3">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-6 rounded-full text-[13px] transition-all shadow-sm">
                                    View Offer
                                </button>
                                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-6 rounded-full text-[13px] transition-all">
                                    Decline
                                </button>
                            </div>
                        )}

                        {notif.quote && (
                            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-[14px] text-slate-500">
                                {notif.quote}
                            </div>
                        )}
                    </div>
                    {notif.unread && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    )}
                </div>
            </div>
        </div>
    )
}
