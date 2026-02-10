'use client'

import React from 'react'
import Link from 'next/link'
import { Wallet, ShieldCheck, TrendingUp, Users, Plus } from 'lucide-react'

export function AccountOverview() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-6 uppercase tracking-tight">Account Overview</h3>

            <div className="mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">My Balance</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">2,450.00</h2>
                    <span className="text-sm font-bold text-slate-500 uppercase">USDC</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-500 mt-1">+ $120.00 today</p>
            </div>

            <button className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mb-4">
                Withdraw Funds
            </button>
        </div>
    )
}

export function TopEarners() {
    const earners = [
        { name: 'Leo V.', earned: '$840 earned', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
        { name: 'Mia Wong', earned: '$620 earned', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia' }
    ]

    return (
        <div className="bg-slate-50 rounded-[2rem] p-8">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Top Earners</h3>
            <div className="space-y-6">
                {earners.map((e) => (
                    <div key={e.name} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0">
                                <img src={e.avatar} alt={e.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm leading-none mb-1">{e.name}</h4>
                                <p className="text-[11px] text-slate-500 font-medium">{e.earned}</p>
                            </div>
                        </div>
                        <button className="px-5 h-9 bg-[#0f1419] hover:bg-[#272c30] text-white rounded-full text-xs font-bold transition-all active:scale-95">
                            Follow
                        </button>
                    </div>
                ))}
            </div>
            <button className="text-[#1d9bf0] hover:underline text-sm font-medium mt-6 block">
                Show more
            </button>
        </div>
    )
}

export function TrendingSkills() {
    const skills = [
        { category: 'Development', tag: '#Solidity', count: '128 active tasks' },
        { category: 'Design', tag: '#MotionGraphics', count: '84 active tasks' },
        { category: 'Writing', tag: '#Copywriting', count: '142 active tasks' }
    ]

    return (
        <div className="bg-slate-50 rounded-[2rem] p-8">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Trending Skills</h3>
            <div className="space-y-8">
                {skills.map((s) => (
                    <div key={s.tag}>
                        <p className="text-[11px] font-medium text-slate-500 mb-0.5">{s.category} · Trending</p>
                        <h4 className="font-black text-slate-900 text-base leading-tight cursor-pointer hover:text-[#1d9bf0] transition-colors">{s.tag}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{s.count}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                <Link href="/terms" className="hover:underline">Terms of Service</Link>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                <Link href="/cookies" className="hover:underline">Cookie Policy</Link>
                <Link href="/accessibility" className="hover:underline">Accessibility</Link>
                <Link href="/ads" className="hover:underline">Ads info</Link>
                <span className="mt-2 block w-full text-slate-400 font-normal">© 2024 TaskBounty Corp.</span>
            </div>
        </div>
    )
}
