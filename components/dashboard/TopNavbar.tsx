'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Search,
    Home,
    Briefcase,
    Megaphone,
    MessageSquare,
    Bell,
    ShieldCheck,
    ChevronDown,
    Settings,
    LogOut,
    User,
    Globe,
    MoreHorizontal,
    CheckCircle2
} from 'lucide-react'
import { signOut } from '@/actions/auth'

export default function TopNavbar({ user, onOpenAuth }: { user: any, onOpenAuth?: (view: 'login' | 'signup') => void }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isLangOpen, setIsLangOpen] = useState(false)
    const [currentLang, setCurrentLang] = useState('English (US)')
    const pathname = usePathname()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const langRef = useRef<HTMLDivElement>(null)

    const languages = [
        { name: 'English (US)', code: 'EN' },
        { name: 'Español (ES)', code: 'ES' },
        { name: 'Français (FR)', code: 'FR' },
        { name: 'Deutsch (DE)', code: 'DE' },
        { name: 'Português (BR)', code: 'PT' }
    ]

    // Auth state helpers
    const isLoggedIn = !!user
    const isWorker = user?.user_metadata?.role === 'worker'
    const rolePrefix = isLoggedIn ? (isWorker ? '/worker' : '/client') : ''

    const navItems = isLoggedIn ? [
        { label: 'Home', icon: Home, href: `${rolePrefix}/dashboard` },
        { label: 'Tasks', icon: Briefcase, href: `${rolePrefix}/tasks` },
        { label: 'Jobs', icon: Megaphone, href: '/tasks/explore' },
        { label: 'Messages', icon: MessageSquare, href: `${rolePrefix}/messages` },
        { label: 'Alerts', icon: Bell, href: `${rolePrefix}/dashboard` },
    ] : []

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false)
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[100] px-4 md:px-8">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
                {/* Logo & Search */}
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <Link href="/" className="flex-shrink-0">
                        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                    <div className="relative flex-1 hidden md:block group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search TaskBounty..."
                            className="w-full bg-slate-100 border-none rounded-lg py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // Handle search
                                    console.log('Searching for:', e.currentTarget.value)
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Nav Items or Auth Buttons */}
                <div className="flex items-center h-full">
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center h-full px-4 border-r border-slate-100 mr-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`flex flex-col items-center justify-center min-w-[70px] h-full text-slate-500 hover:text-slate-900 transition-colors relative group`}
                                        >
                                            <item.icon className={`w-6 h-6 ${isActive ? 'text-slate-900' : ''}`} />
                                            <span className={`text-[11px] mt-1 font-medium ${isActive ? 'text-slate-900' : ''}`}>
                                                {item.label}
                                            </span>
                                            {isActive && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Profile Dropdown Container */}
                            <div className="relative h-full flex items-center" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 h-full px-2"
                                >
                                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden mb-1 flex-shrink-0 border border-slate-100">
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[10px] font-black uppercase text-slate-400">
                                                Me
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[11px] font-medium">Me</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                                    {user?.user_metadata?.avatar_url ? (
                                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-xs font-black uppercase text-slate-400">
                                                            {user?.email?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-slate-900 truncate">
                                                        {user?.user_metadata?.name || user?.email?.split('@')[0]}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`${rolePrefix}/settings`}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="mt-3 block w-full text-center py-1.5 border border-sky-500 text-sky-500 rounded-full text-xs font-bold hover:bg-sky-50 transition-colors"
                                            >
                                                Ver Perfil
                                            </Link>
                                        </div>

                                        <div className="py-2">
                                            <div className="px-4 py-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cuenta</p>
                                                <Link
                                                    href={`${rolePrefix}/settings`}
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Configuracion y Privacidad
                                                </Link>
                                                <Link
                                                    href="#"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Ayuda
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                                            <form action={signOut}>
                                                <button
                                                    type="submit"
                                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all font-medium"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Cerrar Sesion
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onOpenAuth?.('login')}
                                className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => onOpenAuth?.('signup')}
                                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm font-black transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                            >
                                Sign up
                            </button>

                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 ml-4 px-3 py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors text-slate-800 border border-transparent hover:border-slate-200"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">
                                        {languages.find(l => l.name === currentLang)?.code || 'EN'}
                                    </span>
                                </button>

                                {isLangOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.name}
                                                onClick={() => {
                                                    setCurrentLang(lang.name)
                                                    setIsLangOpen(false)
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <span>{lang.name}</span>
                                                {currentLang === lang.name && (
                                                    <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
