import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { followUser } from '@/actions/social'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
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
                {displayUsers.map((userToFollow) => {
                    const isFollowing = followingIds.includes(userToFollow.id)
                    const isLoading = loadingIds.includes(userToFollow.id)
                    const initials = userToFollow.name?.[0] || userToFollow.email?.[0] || 'U'
                    const handle = userToFollow.email?.split('@')[0] || 'user'

                    return (
                        <div key={userToFollow.id} className="flex items-center justify-between">
                            <Link href={`/profile/${userToFollow.id}`} className="flex items-center gap-3 group">
                                <Avatar
                                    src={userToFollow.avatar_url}
                                    fallback={initials}
                                    className="w-9 h-9 border border-slate-100 group-hover:opacity-80 transition-opacity"
                                />
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900 group-hover:text-blue-500 transition-colors line-clamp-1">{userToFollow.name || 'Anonymous'}</p>
                                    <p className="text-[11px] text-slate-500 line-clamp-1">@{handle}</p>
                                </div>
                            </Link>
                            <Button
                                size="sm"
                                onClick={() => !isFollowing && handleFollow(userToFollow.id)}
                                disabled={isFollowing || isLoading}
                                className={`rounded-full text-[11px] font-bold px-4 h-7 transition-all ${isFollowing
                                    ? 'bg-slate-100 text-slate-500 cursor-default hover:bg-slate-100'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                                    }`}
                            >
                                {isLoading ? '...' : isFollowing ? 'FOLLOWED' : 'FOLLOW'}
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
