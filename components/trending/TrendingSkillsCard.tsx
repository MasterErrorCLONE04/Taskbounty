
interface TrendingSkill {
    name: string
    category: string
    activeCount: number
}

export function TrendingSkillsCard() {
    // Data from user snippet
    const trendingSkills: TrendingSkill[] = [
        { name: 'Solidity', category: 'Development', activeCount: 128 },
        { name: 'MotionGraphics', category: 'Design', activeCount: 84 },
        { name: 'Copywriting', category: 'Writing', activeCount: 142 },
    ]

    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Trending Skills</h3>
            <ul className="space-y-4">
                {trendingSkills.map((skill) => (
                    <li key={skill.name} className="cursor-pointer group">
                        <p className="text-[11px] text-slate-500 font-bold mb-0.5">{skill.category} · Trending</p>
                        <p className="font-black text-slate-900 group-hover:text-blue-500 group-hover:underline text-[15px]">#{skill.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{skill.activeCount} active tasks</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
