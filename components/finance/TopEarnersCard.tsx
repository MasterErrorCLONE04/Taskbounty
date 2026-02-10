
interface Earner {
    id: string
    name: string
    amount: number
    avatar: string
}

export function TopEarnersCard() {
    // Data from user snippet
    const topEarners: Earner[] = [
        { id: '1', name: 'Leo V.', amount: 840, avatar: 'https://picsum.photos/seed/leo/100/100' },
        { id: '2', name: 'Mia Wong', amount: 620, avatar: 'https://picsum.photos/seed/mia/100/100' },
    ]

    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Top Earners</h3>
            <div className="space-y-4">
                {topEarners.map((earner) => (
                    <div key={earner.id} className="flex gap-3 group cursor-pointer">
                        <img src={earner.avatar} alt={earner.name} className="w-10 h-10 rounded-full border border-slate-200" />
                        <div className="flex-1 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-blue-500 transition-colors">{earner.name}</h4>
                                <p className="text-[12px] text-slate-500 font-medium">${earner.amount} earned</p>
                            </div>
                            <button className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-slate-800 transition-all">
                                Follow
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="text-blue-500 hover:bg-blue-100/50 w-full text-left mt-5 py-2 px-2 rounded-lg text-[13px] font-bold transition-all">
                Show more
            </button>
        </div>
    )
}
