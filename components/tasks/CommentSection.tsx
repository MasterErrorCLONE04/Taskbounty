'use client'

import { useState } from 'react'
import { addComment } from '@/actions/social'
import { formatDistanceToNow } from 'date-fns'
import { Send } from 'lucide-react'
import Link from 'next/link'

interface Comment {
    id: string
    content: string
    created_at: string
    user: {
        id: string
        name: string
        avatar_url: string
    }
}

interface CommentSectionProps {
    taskId: string
    initialComments: Comment[]
    currentUser: any
    minimal?: boolean
    onCommentAdded?: () => void
}

export function CommentSection({ taskId, initialComments, currentUser, minimal = false, onCommentAdded }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !currentUser) return

        const tempId = Math.random().toString(36).substr(2, 9)
        const optimisticComment: Comment = {
            id: tempId,
            content: newComment,
            created_at: new Date().toISOString(),
            user: {
                id: currentUser.id,
                name: currentUser.name || 'You',
                avatar_url: currentUser.avatar_url || ''
            }
        }

        setComments([...comments, optimisticComment])
        setNewComment('')
        setIsSubmitting(true)
        if (onCommentAdded) onCommentAdded()

        try {
            const { success, error } = await addComment(taskId, optimisticComment.content)
            if (!success) {
                console.error('Failed to post comment:', error)
                // Remove optimistic comment or show error
                setComments(prev => prev.filter(c => c.id !== tempId))
            }
        } catch (err) {
            console.error('Error posting comment:', err)
            setComments(prev => prev.filter(c => c.id !== tempId))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`border-slate-100 ${minimal ? 'mt-4 pt-4 border-t-0' : 'mt-8 border-t pt-8'}`}>
            {!minimal && <h3 className="text-xl font-black text-slate-900 mb-6">Comments ({comments.length})</h3>}

            {/* Input - on top if minimal */}
            {minimal && currentUser && (
                <div className="flex gap-3 items-start mb-6">
                    <img
                        src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full bg-slate-100 object-cover"
                    />
                    <form onSubmit={handleSubmit} className="flex-1 relative">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 pr-10 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-blue-500 disabled:opacity-50 transition-all"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}

            {/* Comment List */}
            <div className={`space-y-4 mb-4 ${minimal ? 'max-h-60 overflow-y-auto pr-2' : ''}`}>
                {comments.length === 0 ? (
                    <p className="text-slate-400 text-xs italic">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group">
                            <Link href={`/profile/${comment.user.id}`}>
                                <img
                                    src={comment.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=random`}
                                    alt={comment.user.name}
                                    className="w-8 h-8 rounded-full bg-slate-100 object-cover"
                                />
                            </Link>
                            <div className="flex-1">
                                <div className="bg-slate-50 rounded-2xl px-3 py-2 rounded-tl-none">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <Link href={`/profile/${comment.user.id}`} className="font-bold text-xs text-slate-900 hover:text-blue-500 hover:underline">
                                            {comment.user.name}
                                        </Link>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-slate-700 text-sm leading-snug">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input - on bottom if NOT minimal */}
            {!minimal && currentUser ? (
                <div className="flex gap-4 items-start">
                    <img
                        src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                    />
                    <form onSubmit={handleSubmit} className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 resize-none min-h-[60px]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit(e)
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="absolute right-3 bottom-3 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-all shadow-sm"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            ) : !minimal && (
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                    <p className="text-slate-500 text-sm mb-2">Please log in to join the conversation.</p>
                    <Link href="/login" className="text-blue-500 font-bold hover:underline text-sm">
                        Log In / Sign Up
                    </Link>
                </div>
            )}
        </div>
    )
}
