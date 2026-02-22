"use client"

import { Star, DollarSign, Eye, Users } from "lucide-react"

interface ProfileStatsProps {
    stats: {
        reputation: number
        earnings: number
        views: number
        followers?: number
        following?: number
    }
}

export function ProfileStats({ stats }: ProfileStatsProps) {
    return (
        <div className="px-6 mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Performance</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">Reputation</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{stats.reputation}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Earnings</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">${stats.earnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Profile Views</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{stats.views}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Followers</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{stats.followers || 0}</span>
                </div>
            </div>
        </div>
    )
}
