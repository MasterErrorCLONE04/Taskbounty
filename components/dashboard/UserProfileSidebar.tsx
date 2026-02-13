'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Hash, Users, Calendar, ArrowRight } from 'lucide-react'

export default function UserProfileSidebar({ user, profile }: { user: any, profile: any }) {
    const isWorker = user?.user_metadata?.role === 'worker'
    const name = profile?.name || user?.email?.split('@')[0] || 'User'
    const avatar = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

    return (
        <div className="space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Cover (placeholder) */}
                <div className="h-14 bg-slate-200 group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 opacity-80" />
                </div>

                {/* Info Container */}
                <div className="px-5 pb-5 pt-0 -mt-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-white bg-slate-100 shadow-md overflow-hidden mb-3">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <Link href="/profile" className="hover:underline">
                        <h4 className="font-bold text-slate-900 leading-tight">{name}</h4>
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 font-medium italic">@{name.toLowerCase().replace(/\s/g, '_')}</p>

                    <div className="mt-4 w-full text-left space-y-1">
                        <p className="text-[11px] font-bold text-slate-400 leading-tight uppercase tracking-tight">Full Stack Developer & Bounty Hunter</p>
                        <div className="flex items-center gap-1.5 text-sky-600 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-sky-600" />
                            Reputation: {profile?.rating || '4.98'} ★
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="border-t border-slate-100 p-5 space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Profile viewers</span>
                        <span className="font-bold text-sky-600">124</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Bounty earnings</span>
                        <span className="font-bold text-sky-600">$2,450</span>
                    </div>
                </div>
            </div>

            {/* Links Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm sticky top-20">
                <nav className="space-y-4">
                    <Link href="#" className="flex items-center justify-between group text-sky-600">
                        <div className="flex items-center gap-3">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-tight">Groups</span>
                        </div>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link href="#" className="flex items-center justify-between group text-sky-600">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-tight">Events</span>
                        </div>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link href="#" className="flex items-center justify-between group text-sky-600">
                        <div className="flex items-center gap-3">
                            <Hash className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-tight">Followed Hashtags</span>
                        </div>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </nav>
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link href="#" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-sky-600 block text-center">
                        Discover more
                    </Link>
                </div>
            </div>
        </div>
    )
}
