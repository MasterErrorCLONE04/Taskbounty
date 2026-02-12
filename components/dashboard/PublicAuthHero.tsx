'use client'

import React from 'react'
import Link from 'next/link'

export default function PublicAuthHero() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm mb-6">
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Welcome to TaskBounty</h1>
            <p className="text-slate-500 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                The professional micro-task social network where expertise meets opportunity.
            </p>
            <div className="flex items-center justify-center gap-3">
                <Link
                    href="/?signup=true"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all active:scale-95"
                >
                    Sign up to post tasks
                </Link>
                <Link
                    href="/help"
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-8 py-3.5 rounded-full text-sm font-bold transition-all active:scale-95"
                >
                    Learn more
                </Link>
            </div>
        </div>
    )
}
