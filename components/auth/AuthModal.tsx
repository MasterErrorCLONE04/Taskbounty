'use client'

import React, { useState, useEffect } from 'react'
import { X, Mail, Lock, User, ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
    isOpen: boolean
    onCloseAction: () => void
    initialView?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onCloseAction, initialView = 'login' }: AuthModalProps) {
    const router = useRouter()
    const [view, setView] = useState<'login' | 'signup'>(initialView)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })

    useEffect(() => {
        if (isOpen) {
            setView(initialView)
            setError(null)
            setLoading(false)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, initialView])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (view === 'login') {
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                })
                if (loginError) throw loginError
            } else {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            name: formData.name,
                            role: 'both' // Default role for new signups
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                })
                if (signUpError) throw signUpError

                // For signup, we might need them to confirm email or they might be auto-logged in
                // If the user is returned, we can proceed
            }

            // Get session to check role and redirect
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                onCloseAction()
                router.push('/')
                router.refresh()
            } else if (view === 'signup') {
                setError('Registration successful! Please check your email to confirm.')
            }

        } catch (err: any) {
            setError(err.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onCloseAction}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Close Button */}
                <button
                    onClick={onCloseAction}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-12">
                    {/* Brand Header */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-1.5 bg-sky-500 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                        {view === 'login' ? 'Welcome back!' : 'Create your account'}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mb-8">
                        {view === 'login'
                            ? 'Log in to manage your bounties and tasks.'
                            : 'Join our community of professionals and clients.'}
                    </p>

                    {/* Social Auth */}
                    <div className="space-y-3 mb-8">
                        <button className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.96.95-2.04 1.8-3.4 1.8-1.41 0-1.84-.86-3.41-.86-1.58 0-2.05.84-3.41.84-1.31 0-2.43-.9-3.46-2.39-2.08-3.03-1.59-7.14.97-9.54 1.27-1.18 2.76-1.82 4.15-1.82 1.48 0 2.45.86 3.51.86 1.06 0 1.9-.86 3.54-.86 1.2 0 3.01.69 4.12 1.82-1.28 1.41-1.38 4.29-.07 5.76.71.8 1.55 1.46 2.41 1.9-.66 2.04-1.63 4.16-3.45 5.23zm-3.43-16.14c.71-.85 1.25-2.01 1.06-3.14-1.04.05-2.13.71-2.9 1.64-.7.83-1.29 2.11-1.06 3.19 1.18.1 2.19-.84 2.9-1.69z" />
                            </svg>
                            Continue with Apple
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">or email</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Email Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {view === 'signup' && (
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-sky-500/30 transition-all active:scale-95 mt-4 flex items-center justify-center disabled:opacity-70 disabled:active:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                view === 'login' ? 'Log in' : 'Create account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center mt-8 text-sm font-medium text-slate-500">
                        {view === 'login'
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            className="text-sky-500 font-bold hover:underline"
                        >
                            {view === 'login' ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
