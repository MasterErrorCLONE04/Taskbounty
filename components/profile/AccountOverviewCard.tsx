
import Link from "next/link"

interface AccountOverviewCardProps {
    balance?: {
        available_balance: number
        pending_balance: number
    }
    stripeConnectId?: string | null
}

export function AccountOverviewCard({ balance, stripeConnectId }: AccountOverviewCardProps) {
    const available = balance?.available_balance || 0
    const pending = balance?.pending_balance || 0

    return (
        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
            <h3 className="text-[17px] font-black text-slate-900 mb-6 tracking-tight">Account Overview</h3>
            <div className="space-y-6">
                <div>
                    <p className="text-[13px] text-slate-500 font-medium mb-1.5">My Balance</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                            {available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[13px] text-slate-500 font-bold uppercase tracking-tight">USDC</span>
                    </div>
                </div>
                <Link
                    href="/wallet/withdraw"
                    className="flex items-center justify-center w-full bg-[#0095ff] hover:bg-[#0080db] text-white h-12 rounded-xl text-[15px] font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                    Withdraw Funds
                </Link>
            </div>
        </div>
    )
}
