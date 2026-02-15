
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface Transaction {
    id: string
    amount: number
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
    created_at: string
}

interface TransactionHistoryProps {
    transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    return (
        <div className="w-full lg:w-80 shrink-0 border-l border-slate-100 bg-white h-full overflow-y-auto hidden xl:block">
            <div className="p-6">
                <h3 className="font-black text-slate-900 text-lg mb-6">Recent Transactions</h3>

                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-sm">No transactions yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-start justify-between group">
                                <div>
                                    <p className="font-bold text-slate-900 text-[15px] mb-0.5">Withdrawal</p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {format(new Date(tx.created_at), 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`
                                        inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-1
                                        ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'}
                                    `}>
                                        {tx.status}
                                    </div>
                                    <p className="font-black text-slate-900 text-sm">
                                        -${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] text-slate-400">USDC</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors">
                        View all transaction history
                    </button>
                    <div className="mt-8 text-[11px] text-slate-400 space-x-3 font-medium">
                        <a href="#" className="hover:text-slate-600">Terms</a>
                        <a href="#" className="hover:text-slate-600">Privacy</a>
                        <a href="#" className="hover:text-slate-600">Help</a>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">
                        © 2024 TaskBounty Corp.
                    </p>
                </div>
            </div>
        </div>
    )
}
