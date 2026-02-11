'use client'

import { useEffect, useState } from 'react'
import { getUserReviews } from '@/actions/profile'
import { Star, Loader2, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ReviewsTabProps {
    userId: string
}

export function ReviewsTab({ userId }: ReviewsTabProps) {
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getUserReviews(userId)
                setReviews(data)
            } catch (error) {
                console.error("Failed to fetch reviews", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchReviews()
    }, [userId])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed mx-4 md:mx-0">
                <MessageSquare className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
                <p className="text-slate-500">This user hasn't received any reviews.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 py-6 px-4 md:px-0 max-w-2xl mx-auto">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={review.reviewer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer?.name || 'A')}&background=random`}
                                alt={review.reviewer?.name || 'Reviewer'}
                                className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                            />
                            <div>
                                <h4 className="font-bold text-slate-900 text-[15px]">{review.reviewer?.name || 'Anonymous'}</h4>
                                <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                            <Star className="fill-yellow-400 text-yellow-400" size={14} />
                            <span className="font-bold text-yellow-700 text-sm">{review.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    {review.comment && (
                        <p className="text-slate-600 text-[15px] leading-relaxed">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}
