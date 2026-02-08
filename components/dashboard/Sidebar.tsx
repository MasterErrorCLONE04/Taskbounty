'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Wallet,
    Settings,
    LogOut,
    ShieldCheck,
    Moon
} from 'lucide-react';
import LogOutButton from './LogOutButton';

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const isWorker = user?.user_metadata?.role === 'worker';
    const rolePrefix = isWorker ? '/worker' : '/client';

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: `${rolePrefix}/dashboard` },
        { label: 'Mis Tareas', icon: Briefcase, href: `${rolePrefix}/tasks` },
        { label: 'Mensajes', icon: MessageSquare, href: `${rolePrefix}/messages` },
        { label: 'Pagos/Wallet', icon: Wallet, href: `${rolePrefix}/wallet` },
        { label: 'Configuración', icon: Settings, href: `${rolePrefix}/settings` },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col z-50 hidden lg:flex">
            {/* Logo Section */}
            <div className="p-10 pb-12">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-sky-500 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 border-b-4 border-sky-500/10">TaskBounty</span>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-[1.4rem] font-black text-[13px] uppercase tracking-wider transition-all group ${isActive
                                    ? 'bg-sky-50 text-sky-500 shadow-sm shadow-sky-100'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-sky-500' : 'group-hover:text-slate-600'}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-8 space-y-6 relative">
                {/* Logout Button */}
                <div className="px-6 py-4 flex items-center gap-4 hover:bg-rose-50 rounded-[1.4rem] transition-all cursor-pointer group">
                    <LogOutButton variant="minimal" />
                </div>

                {/* Theme Toggle Button */}
                <div className="absolute -top-4 right-10 w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 hover:bg-slate-50 cursor-pointer transition-transform hover:scale-110">
                    <Moon className="w-5 h-5 text-slate-900" />
                </div>
            </div>
        </aside>
    );
}
