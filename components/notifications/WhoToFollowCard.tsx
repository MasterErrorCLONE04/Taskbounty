import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { followUser } from '@/actions/social'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { VerifiedBadge } from '@/components/ui/VerifiedBadge'
import { useAuthModal } from '@/components/auth/AuthModalContext'

interface WhoToFollowCardProps {
    users?: any[]
}

export function WhoToFollowCard({ users }: WhoToFollowCardProps) {
    const [followingIds, setFollowingIds] = useState<string[]>([])
    const [loadingIds, setLoadingIds] = useState<string[]>([])
    const { openLogin } = useAuthModal()

    const displayUsers = users || []

    const handleFollow = async (userId: string) => {
        setLoadingIds(prev => [...prev, userId])
        try {
            const result = await followUser(userId)
            if (result.success) {
                setFollowingIds(prev => [...prev, userId])
            } else if (result.error === 'Not authenticated') {
                openLogin()
            }
        } catch (error) {
            console.error('Follow error:', error)
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== userId))
        }
    }

    if (displayUsers.length === 0) return null

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[1.1rem] font-bold text-slate-900">Who to follow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {displayUsers.filter(u => !followingIds.includes(u.id)).map((userToFollow) => {
                    const isLoading = loadingIds.includes(userToFollow.id)
                    const initials = userToFollow.name?.[0] || userToFollow.email?.[0] || 'U'
                    const handle = userToFollow.email?.split('@')[0] || 'user'
                    const isPremium = userToFollow.is_verified || userToFollow.plan === 'premium' || userToFollow.plan === 'pro'

                    return (
                        <div key={userToFollow.id} className="flex items-center justify-between group/item">
                            <Link href={`/profile/${userToFollow.id}`} className="flex items-center gap-3 group">
                                <Avatar
                                    src={userToFollow.avatar_url}
                                    fallback={initials}
                                    className="w-10 h-10 border border-slate-100 group-hover:opacity-80 transition-opacity"
                                />
                                <div>
                                    <div className="flex items-center gap-1">
                                        <p className="text-[13.5px] font-bold text-slate-900 group-hover:text-blue-500 transition-colors line-clamp-1">{userToFollow.name || 'Anonymous'}</p>
                                        <VerifiedBadge className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-[11.5px] text-slate-500 line-clamp-1 mt-0.5">@{handle}</p>
                                </div>
                            </Link>
                            <Button
                                size="sm"
                                onClick={() => handleFollow(userToFollow.id)}
                                disabled={isLoading}
                                className={`rounded-xl normal-case text-[11px] font-bold px-4 h-8 transition-all shadow-sm ${isLoading
                                    ? 'bg-blue-50 text-blue-500 cursor-default shadow-none'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white active:scale-95 border border-blue-100 hover:border-blue-600'
                                    }`}
                            >
                                {isLoading ? '...' : 'Follow'}
                            </Button>
                        </div>
                    )
                })}

                <Link href="/discover" className="block">
                    <Button variant="ghost" className="w-full text-blue-500 text-xs font-bold hover:text-blue-600 hover:bg-blue-50">
                        Show more
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
