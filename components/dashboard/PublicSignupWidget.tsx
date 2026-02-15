'use client'

import React from 'react'
import Link from 'next/link'
import { Chrome } from 'lucide-react'

// Using temporary placeholders for social icons if needed, or lucide icons
export default function PublicSignupWidget({ onOpenAuth }: { onOpenAuth?: (view: 'login' | 'signup') => void }) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">New to TaskBounty?</h3>
            <p className="text-[12px] font-medium text-slate-500 mb-8 leading-relaxed">
                Sign up now to get your own personalized timeline!
            </p>

            <div className="space-y-3">
                <button
                    onClick={() => onOpenAuth?.('signup')}
                    className="w-full h-[3.25rem] flex items-center justify-center gap-3 bg-[#0f1419] hover:bg-[#272c30] text-white rounded-full text-sm font-bold transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="fill-white" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="fill-white" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" className="fill-white" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="fill-white" />
                    </svg>
                    Sign up with Google
                </button>
                <button
                    onClick={() => onOpenAuth?.('signup')}
                    className="w-full h-[3.25rem] flex items-center justify-center gap-3 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5 fill-[#0a66c2]" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                    </svg>
                    Sign up with LinkedIn
                </button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-sm text-slate-500 font-medium">or</span>
                    </div>
                </div>

                <button
                    onClick={() => onOpenAuth?.('signup')}
                    className="w-full h-[3.25rem] bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-black rounded-full text-sm shadow-sm transition-all active:scale-[0.98]"
                >
                    Create account
                </button>
            </div>

            <p className="text-[12px] text-slate-500 mt-8 leading-snug font-medium">
                By signing up, you agree to the <Link href="/terms" className="text-[#1d9bf0] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#1d9bf0] hover:underline">Privacy Policy</Link>.
            </p>
        </div>
    )
}
