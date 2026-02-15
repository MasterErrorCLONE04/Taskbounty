
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'

interface ActivityItem {
    id: string
    type: 'WITHDRAWAL' | 'PAYMENT'
    title: string
    date: string
    amount: number
    status: 'COMPLETED' | 'PENDING' | 'FAILED'
}

interface ActivityListProps {
    activities: ActivityItem[]
}

export function ActivityList({ activities }: ActivityListProps) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 pb-4 flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-lg">Recent Activity</h3>
                <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                    Show more activity
                </button>
            </div>

            <div>
                {activities.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <p className="text-sm font-medium">No recent activity.</p>
                    </div>
                ) : (
                    activities.map((item, index) => (
                        <div key={item.id} className={`flex items-center justify-between p-6 hover:bg-slate-50 transition-colors ${index !== activities.length - 1 ? 'border-b border-slate-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'PAYMENT' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                    {item.type === 'PAYMENT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`block font-black text-sm mb-1 ${item.type === 'PAYMENT' ? 'text-green-600' : 'text-slate-900'
                                    }`}>
                                    {item.type === 'PAYMENT' ? '+' : '-'}${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] text-slate-400">USDC</span>
                                </span>
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide float-right
                                    ${item.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                                        item.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                    }
                                `}>
                                    {item.status}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
