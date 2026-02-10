import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BountyAuthorProps {
    author: {
        name: string
        avatar_url?: string
        handle?: string
        role?: string
    }
    createdAt: string
}

export function BountyAuthor({ author, createdAt }: BountyAuthorProps) {
    return (
        <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
                <Avatar src={author.avatar_url} fallback={author.name[0]} />
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{author.name}</span>
                        <span className="text-slate-500">@{author.handle || author.name.toLowerCase().replace(/\s/g, '')}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                    </div>
                    <div className="text-sm text-slate-500">{author.role || 'Poster'}</div>
                </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
    )
}
