"use client"

import Link from "next/link"
import { MoreHorizontal, MessageCircle, Repeat2, Heart, Lock, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { useState, useRef } from "react"
import { toggleLike, getComments } from "@/actions/social"
import { useRouter } from "next/navigation"
import { CommentSection } from "@/components/tasks/CommentSection"
import { useAuthModal } from "@/components/auth/AuthModalContext"

interface BountyCardProps {
    task: any
    currentUser?: any
}

export function BountyCard({ task, currentUser }: BountyCardProps) {
    const router = useRouter()
    const { openLogin } = useAuthModal()
    const [isLiked, setIsLiked] = useState(task.is_liked || false)
    const [likesCount, setLikesCount] = useState(task.likes_count || 0)
    const [isLikeLoading, setIsLikeLoading] = useState(false)

    // Comments state
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState<any[]>([])
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [commentsCount, setCommentsCount] = useState(task.comments_count || 0)

    if (!task) return null

    // Map existing task data to the visual structure
    const isHighPriority = task.priority || task.status === 'high-priority'

    // Safe user assignment with fallbacks
    const rawUser = task.client || task.author || {}

    const user = {
        id: rawUser.id,
        name: rawUser.name || 'Anonymous User',
        handle: rawUser.username || rawUser.handle || 'user',
        avatar: rawUser.avatar_url || rawUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || 'A')}&background=random`,
        role: rawUser.bio || rawUser.role || 'Member'
    }

    const tags = task.tags || (task.description.match(/#\w+/g)?.map((s: string) => s.slice(1)) || [])
    const cleanContent = task.description
    const repostsCount = 0 // Placeholder

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLikeLoading) return

        // Optimistic update
        const newIsLiked = !isLiked
        setIsLiked(newIsLiked)
        setLikesCount((prev: number) => newIsLiked ? prev + 1 : prev - 1)
        setIsLikeLoading(true)

        try {
            const { success, error } = await toggleLike(task.id)
            if (!success) {
                // Revert
                setIsLiked(!newIsLiked)
                setLikesCount((prev: number) => !newIsLiked ? prev + 1 : prev - 1)

                if (error === 'Not authenticated') {
                    openLogin()
                } else {
                    console.error('Like failed:', error)
                }
            }
        } catch (err) {
            console.error('Like error:', err)
            setIsLiked(!newIsLiked)
            setLikesCount((prev: number) => !newIsLiked ? prev + 1 : prev - 1)
        } finally {
            setIsLikeLoading(false)
        }
    }

    const handleCommentClick = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!showComments && comments.length === 0) {
            setIsLoadingComments(true)
            const fetchedComments = await getComments(task.id)
            setComments(fetchedComments || [])
            setIsLoadingComments(false)
        }

        setShowComments(!showComments)
    }

    return (
        <div
            className="p-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
            onClick={() => {
                // Navigate only if not clicking interactive elements (handled by propagation), 
                // but if comment section is open, maybe we don't want to navigate when clicking the card body?
                // User said "dont redirect to tasks". Assume they mean for the interactions.
                // Keeping navigation for main card click is standard, but if they want "inline everything", maybe navigation is secondary.
                // For now, standard behavior: Card click -> Detail. Button click -> Action.
                router.push(`/tasks/${task.id}`)
            }}
        >
            <div className="flex gap-4">
                <Link href={`/profile/${user.id}`} onClick={(e) => e.stopPropagation()}>
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full shadow-sm object-cover bg-slate-200 hover:opacity-90 transition-opacity"
                    />
                </Link>
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={`/profile/${user.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-bold text-[15px] text-slate-900 hover:text-blue-500 transition-colors hover:underline decoration-blue-500/30"
                                >
                                    {user.name}
                                </Link>
                                <span className="text-slate-500 text-[14px]">
                                    @{user.handle} · {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-500">{user.role || 'Member'}</p>
                        </div>
                        <button className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full p-1.5 transition-all" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mt-2 text-[15px] text-slate-800 leading-normal space-y-4">
                        <p className="whitespace-pre-wrap">{cleanContent}</p>

                        {/* Bounty Details Card */}
                        <div className={`p-4 rounded-2xl border transition-all ${isHighPriority ? 'border-orange-100 bg-orange-50/20' : 'border-slate-100 bg-white'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 ${isHighPriority ? 'text-orange-600' : 'text-blue-500'
                                        }`}>
                                        {isHighPriority ? 'High Priority' : 'Bounty Payment'}
                                    </p>
                                    <p className="text-2xl font-black text-slate-900">${task.bounty_amount} {task.currency}</p>

                                    <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                                        <Clock size={14} />
                                        <span className="text-[12px] font-medium">Est. 2 Hours</span>
                                    </div>

                                    {isHighPriority && (
                                        <p className="text-[11px] text-orange-600 font-extrabold mt-1">DUE TODAY</p>
                                    )}
                                </div>

                                <div className="text-right">
                                    {task.status !== 'completed' ? (
                                        <div className="px-3 py-1 rounded-full bg-green-50 flex items-center gap-1 border border-green-100">
                                            <Lock size={12} className="text-green-600" />
                                            <span className="text-[10px] font-black uppercase text-green-700">Escrow Active</span>
                                        </div>
                                    ) : (
                                        <span className="text-[11px] font-semibold text-slate-400">Verified Client</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hashtags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag: string) => (
                                    <span key={tag} className="text-blue-500 hover:underline font-medium text-[14px]">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Footer */}
                    <div className="flex justify-between items-center mt-4 text-slate-500">
                        <div className="flex items-center gap-5">
                            <button
                                onClick={handleCommentClick}
                                className={`flex items-center gap-1.5 hover:text-blue-500 transition-colors ${showComments ? 'text-blue-500' : ''}`}
                            >
                                <MessageCircle size={18} /> <span className="text-[13px]">{commentsCount}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                                <Repeat2 size={18} /> <span className="text-[13px]">{repostsCount}</span>
                            </button>
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1.5 hover:text-red-500 transition-colors group/heart"
                            >
                                <Heart
                                    size={18}
                                    className={`transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'group-hover/heart:fill-red-500'}`}
                                />
                                <span className={`text-[13px] ${isLiked ? 'text-red-500' : ''}`}>{likesCount}</span>
                            </button>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); /* Logic for apply */ }}
                            className={`px-5 py-1.5 rounded-full font-bold text-[13px] transition-all shadow-sm ${isHighPriority
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}>
                            {isHighPriority ? 'Apply' : 'Easy Apply'}
                        </button>
                    </div>

                    {/* Inline Comments Section */}
                    {showComments && (
                        <div onClick={(e) => e.stopPropagation()} className="cursor-default animate-in fade-in slide-in-from-top-2 duration-200">
                            {isLoadingComments ? (
                                <div className="py-8 text-center text-slate-400 text-xs">Loading conversation...</div>
                            ) : (
                                <CommentSection
                                    taskId={task.id}
                                    initialComments={comments}
                                    currentUser={currentUser}
                                    minimal={true}
                                    onCommentAdded={() => setCommentsCount((prev: number) => prev + 1)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
