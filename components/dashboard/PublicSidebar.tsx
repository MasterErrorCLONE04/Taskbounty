'use client'

import React from 'react'
import Link from 'next/link'
import { Home, Compass, Briefcase, TrendingUp } from 'lucide-react'

export default function PublicSidebar() {
    return (
        <div className="space-y-6">
            <nav className="space-y-2">
                <Link href="/" className="flex items-center gap-4 px-4 py-3 text-slate-900 bg-slate-100 rounded-xl font-bold transition-all group">
                    <Home className="w-6 h-6 fill-slate-900" />
                    <span className="text-[15px]">Home</span>
                </Link>
                <Link href="/tasks/explore" className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-bold transition-all group">
                    <Compass className="w-6 h-6" />
                    <span className="text-[15px]">Explore</span>
                </Link>
                <Link href="/tasks/explore" className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-bold transition-all group">
                    <Briefcase className="w-6 h-6" />
                    <span className="text-[15px]">Jobs</span>
                </Link>
                <Link href="#" className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-bold transition-all group">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-[15px]">Trending</span>
                </Link>
            </nav>

            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mt-8">
                <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">
                    Join TaskBounty to post your own tasks and start earning USDC today.
                </p>
                <Link
                    href="/register"
                    className="block w-full text-center bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all active:scale-95"
                >
                    Join Now
                </Link>
            </div>
        </div>
    )
}
