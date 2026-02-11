
interface AccountOverviewCardProps {
    balance?: {
        available_balance: number
        pending_balance: number
    }
}

export function AccountOverviewCard({ balance }: AccountOverviewCardProps) {
    const available = balance?.available_balance || 0
    const pending = balance?.pending_balance || 0

    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Account Overview</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-[13px] text-slate-500 font-semibold mb-1">My Balance</p>
                    <div className="flex items-end gap-1.5">
                        <span className="text-3xl font-black text-slate-900 leading-none">
                            {available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[14px] text-slate-500 font-bold mb-1 uppercase tracking-tight">USDC</span>
                    </div>
                    {pending > 0 && (
                        <p className="text-[12px] text-slate-400 font-bold mt-2">
                            +${pending.toLocaleString('en-US', { minimumFractionDigits: 2 })} pending
                        </p>
                    )}
                </div>
                <button className="w-full bg-blue-500 text-white py-3 rounded-2xl text-[14px] font-black shadow-md shadow-blue-100 hover:bg-blue-600 transition-all">
                    Withdraw Funds
                </button>
            </div>
        </div>
    )
}
