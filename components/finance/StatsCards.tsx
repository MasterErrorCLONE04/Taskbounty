
interface StatsCardsProps {
    totalEarned: number
    inEscrow: number
    bountiesDone: number
}

export function StatsCards({ totalEarned, inEscrow, bountiesDone }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Total Earned</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">In Escrow</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-orange-500">${inEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Bounties Done</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{bountiesDone}</span>
                </div>
            </div>
        </div>
    )
}
