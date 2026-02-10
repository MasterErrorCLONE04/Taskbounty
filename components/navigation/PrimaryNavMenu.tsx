
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Users, MessageSquare, Bell } from "lucide-react"

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

    return (
        <nav className="flex items-center h-full">
            {navItems.map((item) => {
                const active = isActiveLink(item.href)
                return (
                    <Link key={item.label} href={item.href}>
                        <div className={`flex flex-col items-center justify-center min-w-[72px] h-14 transition-all relative ${active ? 'text-blue-500' : 'text-slate-500 hover:text-slate-900'
                            }`}>
                            <item.icon size={22} className={active ? 'fill-blue-500/10' : ''} />
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
