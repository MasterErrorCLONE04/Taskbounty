"use client"

import { useEffect, useState } from "react"
import { getTrendingSkills } from "@/actions/stats"
import { TrendingUp } from "lucide-react"

interface TrendingSkill {
    name: string
    category: string
    activeCount: number
}

export function TrendingSkillsCard() {
    const [trendingSkills, setTrendingSkills] = useState<TrendingSkill[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getTrendingSkills()
                setTrendingSkills(data)
            } catch (error) {
                console.error("Error fetching trending skills:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading && trendingSkills.length === 0) {
        return (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 w-20 bg-slate-200 rounded"></div>
                            <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            <div className="h-3 w-16 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!loading && trendingSkills.length === 0) {
        return null
    }

    return (
        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
            <h3 className="text-[17px] font-black text-slate-900 mb-6 tracking-tight">Trending Skills</h3>
            <div className="space-y-6">
                {trendingSkills.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                        <div>
                            <h4 className="text-[15px] font-black text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors">#{skill.name}</h4>
                            <p className="text-[13px] text-slate-500 font-medium">{skill.activeCount} active tasks</p>
                        </div>
                        <TrendingUp size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    )
}
