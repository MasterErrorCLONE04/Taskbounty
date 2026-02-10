'use client'

import React from 'react'
import Link from 'next/link'
import {
    MoreHorizontal,
    MessageCircle,
    Repeat2,
    Heart,
    ShieldIcon,
    Clock,
    CheckCircle2
} from 'lucide-react'

export default function SocialBountyCard({ task }: { task: any }) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const formatRelativeTime = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diff < 60) return `${diff}s`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    }

    const client = task.client || {};
    const name = client.name || 'Anonymous User';
    const avatar = client.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
    const handle = name.toLowerCase().replace(/\s/g, '');
    const bio = client.bio || (task.client_role === 'worker' ? 'Professional Worker' : 'Entrepreneur & Client');
    const timeAgo = mounted ? formatRelativeTime(task.created_at) : '...';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 group transition-all hover:border-slate-300">
            {/* Header */}
            <div className="px-5 pt-4 pb-2 flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                            src={avatar}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h4 className="font-bold text-slate-900 text-[14px] leading-tight hover:underline cursor-pointer flex items-center gap-1">
                                {name}
                                <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/10" />
                            </h4>
                            <span className="text-slate-400 text-[13px] font-medium mr-2">
                                @{handle} · {timeAgo}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{bio}</p>
                    </div>
                </div>
                <button className="p-1 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="px-5 py-2">
                <p className="text-[13px] text-slate-800 leading-relaxed">
                    {task.description}
                </p>
                <div className="flex gap-2 mt-4 text-[12px] font-bold text-sky-600">
                    <span className="hover:underline cursor-pointer">#ReactJS</span>
                    <span className="hover:underline cursor-pointer">#WebDev</span>
                    <span className="hover:underline cursor-pointer">#Bounty</span>
                </div>
            </div>

            {/* Bounty Summary Box */}
            <div className="px-5 py-4">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Bounty Payment</p>
                            <h3 className="text-2xl font-black text-slate-900">${task.bounty_amount} <span className="text-sm font-bold text-slate-500">USDC</span></h3>
                            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 font-bold">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> Est. 2 Hours
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ESCROW SECURE
                            </div>
                            <Link
                                href={`/tasks/${task.id}`}
                                className="px-8 py-2.5 bg-sky-500 text-white rounded-full text-[13px] font-black hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                            >
                                Apply
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Actions */}
            <div className="px-4 py-1 flex items-center gap-8 border-t border-slate-50">
                <button className="flex items-center gap-2 group text-slate-400 hover:text-sky-500 transition-colors p-3">
                    <MessageCircle className="w-4 h-4 group-hover:fill-sky-500/10" />
                    <span className="text-[11px] font-bold">8</span>
                </button>
                <button className="flex items-center gap-2 group text-slate-400 hover:text-emerald-500 transition-colors p-3">
                    <Repeat2 className="w-4 h-4" />
                    <span className="text-[11px] font-bold">2</span>
                </button>
                <button className="flex items-center gap-2 group text-slate-400 hover:text-rose-500 transition-colors p-3">
                    <Heart className="w-4 h-4 group-hover:fill-rose-500" />
                    <span className="text-[11px] font-bold">15</span>
                </button>
            </div>
        </div>
    )
}
