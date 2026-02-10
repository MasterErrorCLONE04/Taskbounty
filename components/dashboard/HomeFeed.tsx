'use client'

import React from 'react'
import BountyCreator from './BountyCreator'
import SocialBountyCard from './SocialBountyCard'

export default function HomeFeed({ user, tasks }: { user: any, tasks: any[] }) {
    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {user && <BountyCreator user={user} />}

            {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                    <SocialBountyCard key={task.id} task={task} />
                ))
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-20 text-center shadow-sm">
                    <p className="text-slate-400 font-black uppercase tracking-widest">No bounty posts found yet...</p>
                </div>
            )}
        </div>
    )
}
