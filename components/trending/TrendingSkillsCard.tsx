"use client"

import { useEffect, useState } from "react"
import { getTrendingSkills } from "@/actions/stats"

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
