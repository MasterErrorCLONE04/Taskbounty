"use client"

import { Avatar } from "@/components/ui/Avatar"
import { VerifiedBadge } from "@/components/ui/VerifiedBadge"

interface ProfileHeaderProps {
    user: any
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    if (!user) return null

    const bannerUrl = user.banner_url || user.user_metadata?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop"
    const avatarUrl = user.avatar_url || user.user_metadata?.avatar_url
    const userName = user.name || user.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'User'
    const handle = `@${user.username || user.user_name || user.user_metadata?.user_name || user.email?.split('@')[0] || 'user'}`
    const bio = user.bio || user.user_metadata?.bio || "CEO · TaskBounty"
    const isPremium = user.is_verified || user.plan === 'premium' || user.plan === 'pro'

    return (
        <div>
            {/* Banner & Avatar */}
            <div className="relative h-24 bg-slate-100">
                <img
                    src={bannerUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-10 left-6">
                    <Avatar
                        src={avatarUrl}
                        fallback={userName[0]}
                        className="w-20 h-20 border-4 border-white shadow-sm"
                    />
                </div>
            </div>

            <div className="pt-12 px-6 pb-6">
                {/* Identity */}
                <div className="mb-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h2 className="text-lg font-black text-slate-900 leading-tight">{userName}</h2>
                        {isPremium && <VerifiedBadge className="w-4 h-4 ml-0.5" />}
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-2">{handle}</p>
                    <p className="text-sm text-slate-600 font-medium">{bio}</p>
                </div>
            </div>
        </div>
    )
}
