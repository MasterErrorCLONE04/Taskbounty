"use client"

import { useEffect, useState } from "react"
import { getQuickStats } from "@/actions/stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function QuickStatsCard() {
    const [stats, setStats] = useState<{
        successRate: string
        avgRating: number
        activeBounties: number
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getQuickStats()
                if (data) {
                    setStats(data)
                }
            } catch (error) {
                console.error("Error fetching quick stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <Card className="border-slate-100 shadow-sm animate-pulse">
                <CardHeader className="pb-2">
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-4 w-20 bg-slate-200 rounded"></div>
                            <div className="h-4 w-10 bg-slate-200 rounded"></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (!stats) return null

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[1.1rem] font-bold text-slate-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Success Rate</span>
                    <span className="text-sm font-bold text-slate-900">{stats.successRate}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Avg. Rating</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        {stats.avgRating} <span className="text-slate-900 text-[10px]">★</span>
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Active Bounties</span>
                    <span className="text-sm font-bold text-slate-900">{stats.activeBounties}</span>
                </div>
            </CardContent>
        </Card>
    )
}
