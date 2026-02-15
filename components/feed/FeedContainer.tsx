"use client"

import { useState } from "react"
import { CreateBountyCard } from "./CreateBountyCard"
import { BountyCard } from "./BountyCard"

interface FeedContainerProps {
    user: any
    tasks: any[]
    followedTasks: any[]
}

type TabType = 'recent' | 'highest_paid' | 'following'

export function FeedContainer({ user, tasks = [], followedTasks = [] }: FeedContainerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('recent')

    const sortedTasks = [...tasks].sort((a, b) => {
        if (activeTab === 'recent') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        if (activeTab === 'highest_paid') {
            return Number(b.bounty_amount) - Number(a.bounty_amount)
        }
        return 0
    })

    // Determine which tasks to display based on active tab
    const displayTasks = (activeTab === 'following' ? followedTasks : sortedTasks) || []

    return (
        <div>
            {user && <CreateBountyCard user={user} />}

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-100 mb-6 px-1">
                <button
                    onClick={() => setActiveTab('recent')}
                    className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === 'recent'
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Recent Bounties
                    {activeTab === 'recent' && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0095ff] rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('highest_paid')}
                    className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === 'highest_paid'
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Highest Paid
                    {activeTab === 'highest_paid' && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0095ff] rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === 'following'
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Following
                    {activeTab === 'following' && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0095ff] rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {displayTasks.map((task) => (
                    <BountyCard key={task.id} task={task} currentUser={user} />
                ))}

                {displayTasks.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-slate-400 font-medium">
                            {activeTab === 'following' ? 'You are not following anyone yet.' : 'No active bounties found.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
