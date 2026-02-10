import { MessageCircle, Repeat2, Heart, Share } from "lucide-react"

interface BountyStatsBarProps {
    comments?: number
    shares?: number
    likes?: number
}

export function BountyStatsBar({ comments = 0, shares = 0, likes = 0 }: BountyStatsBarProps) {
    return (
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-400 hover:text-sky-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-sky-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{comments}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
                        <Repeat2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{shares}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-rose-50 transition-colors">
                        <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{likes}</span>
                </button>
            </div>

            <button className="text-slate-400 hover:text-sky-500 transition-colors p-2 hover:bg-sky-50 rounded-full">
                <Share className="w-4 h-4" />
            </button>
        </div>
    )
}
