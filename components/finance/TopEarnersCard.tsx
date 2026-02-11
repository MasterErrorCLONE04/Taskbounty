
"use client"

import { useEffect, useState } from "react"
import { getTopEarners } from "@/actions/finance"
import { followUser, unfollowUser, getFollowStatus } from "@/actions/social"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

interface Earner {
    id: string
    name: string
    amount: number
    avatar: string
    isFollowing?: boolean
}

export function TopEarnersCard() {
    const [topEarners, setTopEarners] = useState<Earner[]>([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(3)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const earners = await getTopEarners(limit) as Earner[]

                // Fetch follow status for each earner
                const earnersWithFollowStatus = await Promise.all(
                    earners.map(async (earner) => {
                        const { isFollowing } = await getFollowStatus(earner.id)
                        return { ...earner, isFollowing }
                    })
                )

                setTopEarners(earnersWithFollowStatus)
            } catch (error) {
                console.error("Error fetching top earners:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [limit])

    const handleFollowToggle = async (earnerId: string, isFollowing: boolean) => {
        const action = isFollowing ? unfollowUser : followUser
        const result = await action(earnerId)

        if (result.success) {
            setTopEarners(prev =>
                prev.map(e => e.id === earnerId ? { ...e, isFollowing: !isFollowing } : e)
            )
        }
    }

    if (loading && topEarners.length === 0) {
        return (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                <div className="h-3 w-16 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!loading && topEarners.length === 0) {
        return null // Or a message saying no earners yet
    }

    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Top Earners</h3>
            <div className="space-y-4">
                {topEarners.map((earner) => (
                    <div key={earner.id} className="flex gap-3 group items-center">
                        <Link href={`/profile/${earner.id}`}>
                            <img src={earner.avatar} alt={earner.name} className="w-10 h-10 rounded-full border border-slate-200 cursor-pointer object-cover" />
                        </Link>
                        <div className="flex-1 flex justify-between items-center">
                            <Link href={`/profile/${earner.id}`} className="group">
                                <div>
                                    <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-sky-500 transition-colors">{earner.name}</h4>
                                    <p className="text-[12px] text-slate-500 font-medium">${earner.amount.toLocaleString()} earned</p>
                                </div>
                            </Link>
                            <Button
                                size="sm"
                                variant={earner.isFollowing ? "outline" : "secondary"}
                                onClick={() => handleFollowToggle(earner.id, !!earner.isFollowing)}
                                className="h-8 px-4 rounded-full text-[12px]"
                            >
                                {earner.isFollowing ? "Following" : "Follow"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {topEarners.length >= limit && (
                <button
                    onClick={() => setLimit(prev => prev + 3)}
                    className="text-sky-500 hover:bg-sky-100/50 w-full text-left mt-5 py-2 px-2 rounded-lg text-[13px] font-bold transition-all"
                >
                    Show more
                </button>
            )}
        </div>
    )
}
