"use client"

import { MoreHorizontal, MessageCircle, Repeat2, Heart, Lock, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BountyCardProps {
    task: any
}

export function BountyCard({ task }: BountyCardProps) {
    if (!task) return null

    // Map existing task data to the visual structure
    // We assume some defaults for data missing in the current schema to match the design
    const isHighPriority = task.priority || task.status === 'high-priority'

    // Safe user assignment with fallbacks
    // The query returns `client` (joined from users table), but we handle `author` too just in case
    const rawUser = task.client || task.author || {}

    const user = {
        name: rawUser.name || 'Anonymous User',
        handle: rawUser.username || rawUser.handle || 'user',
        avatar: rawUser.avatar_url || rawUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || 'A')}&background=random`,
        role: rawUser.bio || rawUser.role || 'Member' // Using bio as role/title fallback
    }

    const tags = task.tags || (task.description.match(/#\w+/g)?.map((s: string) => s.slice(1)) || [])
    const cleanContent = task.description

    // Mock stats for visual fidelity as per design
    const stats = { replies: 8, reposts: 2, likes: 15 }

    return (
        <div className="p-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group">
            <div className="flex gap-4">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full shadow-sm object-cover bg-slate-200"
                />
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[15px] text-slate-900 hover:text-blue-500 transition-colors">{user.name}</span>
                                <span className="text-slate-500 text-[14px]">
                                    @{user.handle || user.username || 'user'} · {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-500">{user.role || 'Member'}</p>
                        </div>
                        <button className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full p-1.5 transition-all">
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
                            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                <MessageCircle size={18} /> <span className="text-[13px]">{stats.replies}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                                <Repeat2 size={18} /> <span className="text-[13px]">{stats.reposts}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors group/heart">
                                <Heart size={18} className="group-hover/heart:fill-red-500" /> <span className="text-[13px]">{stats.likes}</span>
                            </button>
                        </div>
                        <button className={`px-5 py-1.5 rounded-full font-bold text-[13px] transition-all shadow-sm ${isHighPriority
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}>
                            {isHighPriority ? 'Apply' : 'Easy Apply'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
