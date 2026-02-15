"use client"

import Link from "next/link"
import { MoreHorizontal, MessageCircle, Repeat2, Heart, Lock, Copy, Flag, EyeOff, Edit, Trash, User, Users } from "lucide-react"
import { VerifiedBadge } from "@/components/ui/VerifiedBadge"
import { formatDistanceToNow } from "date-fns"

import { useState, useRef, useEffect } from "react"
import { toggleLike, getComments } from "@/actions/social"
import { hideTask } from "@/actions/reports"
import { useRouter } from "next/navigation"
import { CommentSection } from "@/components/tasks/CommentSection"
import { useAuthModal } from "@/components/auth/AuthModalContext"
import { ReportTaskModal } from "./ReportTaskModal"

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
    const [isHidden, setIsHidden] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [linkCopied, setLinkCopied] = useState(false)

    // Comments state
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState<any[]>([])
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [commentsCount, setCommentsCount] = useState(task.comments_count || 0)

    // Menu state
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (!task || isHidden) return null

    // Safe user assignment with fallbacks
    const rawUser = task.client || task.author || {}

    const user = {
        id: rawUser.id,
        name: rawUser.name || 'Anonymous User',
        handle: rawUser.username || rawUser.handle || 'user',
        avatar: rawUser.avatar_url || rawUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || 'A')}&background=random`,
        role: rawUser.bio || rawUser.role || 'Member',
        isVerified: rawUser.is_verified || false // Assuming verification check
    }

    const tags = task.tags || (task.description.match(/#\w+/g)?.map((s: string) => s.slice(1)) || [])

    // Check if current user is the author
    const isAuthor = currentUser?.id === task.client_id || currentUser?.id === user.id

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLikeLoading) return

        const newIsLiked = !isLiked
        setIsLiked(newIsLiked)
        setLikesCount((prev: number) => newIsLiked ? prev + 1 : prev - 1)
        setIsLikeLoading(true)

        try {
            const { success, error } = await toggleLike(task.id)
            if (!success) {
                setIsLiked(!newIsLiked)
                setLikesCount((prev: number) => !newIsLiked ? prev + 1 : prev - 1)
                if (error === 'Not authenticated') openLogin()
            }
        } catch (err) {
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

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation()
        const url = `${window.location.origin}/tasks/${task.id}`
        navigator.clipboard.writeText(url)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
        setShowMenu(false)
    }

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowReportModal(true)
        setShowMenu(false)
    }

    const handleNotInterested = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsHidden(true) // Optimistic hide
        await hideTask(task.id)
        setShowMenu(false)
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/tasks/${task.id}/manage`)
        setShowMenu(false)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this task?")) {
            // Call delete action here
        }
        setShowMenu(false)
    }

    return (
        <>
            <div
                className="bg-white border-b border-slate-100 hover:bg-slate-50/30 transition-colors cursor-pointer group p-5 sm:p-6"
                onClick={() => router.push(`/tasks/${task.id}`)}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                        <Link href={`/profile/${user.id}`} onClick={(e) => e.stopPropagation()}>
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover bg-slate-100 shadow-sm border-2 border-white"
                                />
                            </div>
                        </Link>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={`/profile/${user.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-bold text-[16px] text-slate-900 hover:text-blue-600 transition-colors"
                                >
                                    {user.name}
                                </Link>
                                {user.isVerified && <VerifiedBadge className="w-4 h-4" />}
                                <span className="text-slate-400 text-[13px] font-medium">· {formatDistanceToNow(new Date(task.created_at))} ago</span>
                            </div>
                            <p className="text-[13px] text-slate-500 font-medium">{user.role}</p>
                        </div>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-all -mr-2"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowMenu(!showMenu)
                            }}
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                                <button
                                    onClick={handleCopyLink}
                                    className="text-left px-4 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                >
                                    <Copy size={16} className={linkCopied ? "text-green-500" : "text-slate-400"} />
                                    {linkCopied ? <span className="text-green-600">Copied!</span> : "Copy Link"}
                                </button>

                                {isAuthor ? (
                                    <>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <button
                                            onClick={handleEdit}
                                            className="text-left px-4 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Edit size={16} className="text-slate-400" />
                                            Edit Task
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="text-left px-4 py-2.5 text-[14px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Trash size={16} />
                                            Delete Task
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleNotInterested}
                                            className="text-left px-4 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                        >
                                            <EyeOff size={16} className="text-slate-400" />
                                            Not interested
                                        </button>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <button
                                            onClick={handleReport}
                                            className="text-left px-4 py-2.5 text-[14px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Flag size={16} />
                                            Report Task
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-[19px] font-black text-slate-900 mb-4 leading-tight">{task.title}</h3>

                {/* Metadata Capsules */}
                <div className="flex flex-wrap gap-2.5 mb-5">
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg flex items-center gap-2 border border-slate-200/50">
                        <Users size={14} className="text-slate-500" />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-wide">GENERAL</span>
                    </div>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg flex items-center gap-2 border border-slate-200/50">
                        <User size={14} className="text-slate-500" />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-wide">25 APPLICANTS</span>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-50 rounded-lg flex items-center gap-2 border border-emerald-100/50">
                        <Lock size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wide">FIXED PAYMENT</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[15px] text-slate-600 leading-relaxed mb-6 font-medium">
                    {task.description}
                </p>

                {/* Boxed Bounty Section */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">BOUNTY AMOUNT</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-[#0095ff]">${Number(task.bounty_amount).toFixed(2)}</span>
                            <span className="text-sm font-bold text-slate-400">{task.currency || 'USD'}</span>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!currentUser) openLogin();
                            else router.push(`/tasks/${task.id}`);
                        }}
                        className="bg-[#0095ff] hover:bg-[#0080db] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-[15px]"
                    >
                        Apply Now
                    </button>
                </div>

                {/* Footer / Progress */}
                <div className="relative pt-1 px-1">
                    <div className="flex mb-2 items-center justify-between">
                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">
                            Funding Secured 100%
                        </span>
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-wider">
                            Ends in 6h
                        </span>
                    </div>
                    <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-slate-100">
                        <div
                            style={{ width: "100%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 rounded-full"
                        ></div>
                    </div>
                </div>

                {/* Inline Comments Section */}
                {showComments && (
                    <div onClick={(e) => e.stopPropagation()} className="cursor-default mt-4 border-t border-slate-100 pt-4">
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

            <ReportTaskModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                taskId={task.id}
            />
        </>
    )
}
