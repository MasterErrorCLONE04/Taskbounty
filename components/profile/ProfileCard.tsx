"use client"

import { ProfileHeader } from "./card/ProfileHeader"
import { ProfileStats } from "./card/ProfileStats"
import { ProfileNavigation } from "./card/ProfileNavigation"
import { PremiumPromo } from "./card/PremiumPromo"

interface ProfileCardProps {
    user: any
    stats?: {
        reputation: number
        earnings: number
        views: number
        followers?: number
        following?: number
    }
}

export function ProfileCard({ user, stats = { reputation: 0, earnings: 0, views: 0, followers: 0, following: 0 } }: ProfileCardProps) {
    if (!user) return null

    return (
        <div className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm mb-6">
            <ProfileHeader user={user} />
            <ProfileStats stats={stats} />

            <div className="w-full h-px bg-slate-100 mb-6" />

            <ProfileNavigation stats={stats} />
            <PremiumPromo isPremium={user.is_verified || user.plan === 'premium' || user.plan === 'pro'} />
        </div>
    )
}
