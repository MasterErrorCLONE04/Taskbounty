"use client"

import Link from "next/link"
import { Bookmark, Users, Calendar, Hash, User } from "lucide-react"

interface ProfileNavigationProps {
    stats?: {
        following?: number
    }
}

export function ProfileNavigation({ stats }: ProfileNavigationProps) {
    return (
        <div className="px-6 mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Navigation</h3>

            <div className="space-y-4">
                <Link href="/saved" className="flex items-center gap-3 text-slate-600 hover:text-blue-500 transition-colors group">
                    <Bookmark className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium">Saved</span>
                </Link>

                <Link href="/groups" className="flex items-center gap-3 text-slate-600 hover:text-blue-500 transition-colors group">
                    <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium">Groups</span>
                </Link>

                <Link href="/events" className="flex items-center gap-3 text-slate-600 hover:text-blue-500 transition-colors group">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium">Events</span>
                </Link>

                <Link href="/tags" className="flex items-center gap-3 text-slate-600 hover:text-blue-500 transition-colors group">
                    <Hash className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium">Followed Tags</span>
                </Link>

                <Link href="/following" className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 rounded-lg -mx-2 px-2 py-1 transition-all">
                    <div className="flex items-center gap-3 text-slate-600 group-hover:text-blue-500 transition-colors">
                        <User className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-medium">Following</span>
                    </div>
                    <span className="text-xs font-bold text-blue-500">{stats?.following || 0}</span>
                </Link>
            </div>
        </div>
    )
}
