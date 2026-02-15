
interface EarningsChartProps {
    data: { month: string; amount: number }[]
}

export function EarningsChart({ data }: EarningsChartProps) {
    const maxAmount = Math.max(...data.map(d => d.amount), 100) // Avoid division by zero

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 text-lg">Earnings History</h3>
                <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    Last 6 months
                </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-4">
                {data.map((item, index) => {
                    const heightPercentage = (item.amount / maxAmount) * 100
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                            <div className="relative w-full flex justify-center items-end h-full">
                                <div
                                    className="w-full max-w-[40px] bg-blue-100 rounded-t-lg transition-all duration-500 group-hover:bg-blue-500"
                                    style={{ height: `${heightPercentage}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md transition-opacity whitespace-nowrap pointer-events-none">
                                        ${item.amount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.month}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
