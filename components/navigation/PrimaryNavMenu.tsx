
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Users, MessageSquare, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { getUnreadCount } from "@/actions/notifications"
import { supabase } from "@/lib/supabase/client"

export function PrimaryNavMenu() {
    const pathname = usePathname()

    // Helper to determine active state (simple matching for now)
    const isActiveLink = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Users, label: 'Tasks', href: '/tasks' },
        { icon: Briefcase, label: 'Jobs', href: '/jobs' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: Bell, label: 'Alerts', href: '/notifications' },
    ]

    const [unreadNotifications, setUnreadNotifications] = useState(0)

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;
        
        supabase.auth.getUser().then(({ data }) => {
            const user = data?.user
            if (!user) return

            // 1. Initial Fetch
            getUnreadCount().then(count => {
                setUnreadNotifications(count)
            }).catch(err => console.error('Fetch count error:', err))

            // 2. Real-time Subscription
            channel = supabase.channel('nav-notifications-badge')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, () => {
                    setUnreadNotifications(prev => prev + 1)
                })
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    if (payload.new.read === true && payload.old.read === false) {
                        setUnreadNotifications(prev => Math.max(0, prev - 1))
                    } else if (payload.new.read === false && payload.old.read === true) {
                        setUnreadNotifications(prev => prev + 1) // Just in case
                    }
                })
                .subscribe()
        })

        return () => {
            if (channel) supabase.removeChannel(channel)
        }
    }, [])

    return (
        <nav className="flex items-center h-full">
            {navItems.map((item) => {
                const active = isActiveLink(item.href)
                return (
                    <Link key={item.label} href={item.href}>
                        <div className={`flex flex-col items-center justify-center min-w-[72px] h-14 transition-all relative ${active ? 'text-blue-500' : 'text-slate-500 hover:text-slate-900'
                            }`}>
                            
                            <div className="relative">
                                <item.icon size={22} className={active ? 'fill-blue-500/10' : ''} />
                                
                                {/* Notification Badge */}
                                {item.label === 'Alerts' && unreadNotifications > 0 && (
                                    <div className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 border-2 border-white rounded-full flex items-center justify-center pointer-events-none animate-in zoom-in duration-300">
                                        <span className="text-[10px] font-bold text-white leading-none shadow-sm">
                                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <span className={`text-[11px] mt-0.5 font-medium ${active ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                            {active && <div className="absolute bottom-0 w-full h-1 bg-blue-500 rounded-t-full" />}
                        </div>
                    </Link>
                )
            })}
        </nav>
    )
}
