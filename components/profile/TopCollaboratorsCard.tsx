
export function TopCollaboratorsCard() {
    const topEarners = [
        { name: 'Leo V.', amount: 'Senior DevOps', avatar: 'https://ui-avatars.com/api/?name=Leo+V&background=random' },
        { name: 'Mia Wong', amount: 'Product Designer', avatar: 'https://ui-avatars.com/api/?name=Mia+Wong&background=random' },
    ]

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-5 tracking-tight">Top Collaborators</h3>
            <div className="space-y-4">
                {topEarners.map((collab) => (
                    <div key={collab.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={collab.avatar} alt={collab.name} className="w-10 h-10 rounded-full shadow-sm" />
                            <div>
                                <p className="text-[14px] font-black text-slate-900">{collab.name}</p>
                                <p className="text-[12px] text-slate-400 font-medium">{collab.amount}</p>
                            </div>
                        </div>
                        <button className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[12px] font-bold hover:bg-slate-800 transition-all">
                            Follow
                        </button>
                    </div>
                ))}
            </div>
            <button className="text-blue-500 font-bold text-[13px] mt-6 block hover:underline">
                Show more
            </button>
        </div>
    )
}
