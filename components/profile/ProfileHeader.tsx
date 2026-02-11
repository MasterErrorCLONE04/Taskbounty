"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { startConversation } from '@/actions/messages'
import { followUser, unfollowUser, getFollowStatus } from '@/actions/social'
import { createBrowserClient } from '@supabase/ssr'

interface ProfileHeaderProps {
    user: any
    isOwnProfile?: boolean
    onEdit: () => void
}

export function ProfileHeader({ user, isOwnProfile = true, onEditAction }: { user: any, isOwnProfile?: boolean, onEditAction: () => void }) {
    const router = useRouter()
    const [isLoadingMessage, setIsLoadingMessage] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoadingFollow, setIsLoadingFollow] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        if (user?.id && !isOwnProfile) {
            getFollowStatus(user.id).then(res => setIsFollowing(res.isFollowing))
        }
    }, [user?.id, isOwnProfile])

    const handleMessage = async () => {
        if (!user?.id) return
        setIsLoadingMessage(true)
        try {
            const result = await startConversation(user.id)
            if (result.conversationId) {
                router.push(`/messages?id=${result.conversationId}`)
            }
        } catch (error) {
            console.error('Error starting conversation:', error)
        } finally {
            setIsLoadingMessage(false)
        }
    }

    const handleFollow = async () => {
        if (!user?.id) return
        setIsLoadingFollow(true)
        try {
            if (isFollowing) {
                await unfollowUser(user.id)
                setIsFollowing(false)
            } else {
                await followUser(user.id)
                setIsFollowing(true)
            }
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setIsLoadingFollow(false)
        }
    }

    return (
        <div className="relative mb-20">
            {/* Banner */}
            <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                {user?.banner_url ? (
                    <img src={user.banner_url} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="absolute -top-16 left-6 border-4 border-white rounded-full bg-white">
                    <img
                        src={user?.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"}
                        alt={user?.name}
                        className="w-32 h-32 rounded-full object-cover bg-slate-200"
                    />
                </div>

                <div className="absolute -bottom-12 right-6 flex gap-3">
                    {isOwnProfile ? (
                        <Button
                            onClick={onEditAction}
                            variant="outline"
                            className="rounded-full font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                            Edit profile
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleMessage}
                                disabled={isLoadingMessage}
                                className="rounded-full font-bold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <MessageSquare size={18} />
                                {isLoadingMessage ? 'Loading...' : 'Message'}
                            </Button>
                            <Button
                                onClick={handleFollow}
                                disabled={isLoadingFollow}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className={`rounded-full font-bold flex items-center gap-2 transition-all min-w-[120px] justify-center shadow-sm ${isFollowing
                                        ? 'bg-blue-500 text-white hover:bg-red-500 hover:text-white border border-blue-500 hover:border-red-500'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                                    }`}
                            >
                                {isLoadingFollow ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : isFollowing ? (
                                    isHovering ? (
                                        <>Unfollow</>
                                    ) : (
                                        <><UserCheck size={18} /> Following</>
                                    )
                                ) : (
                                    <><UserPlus size={18} /> Follow</>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
