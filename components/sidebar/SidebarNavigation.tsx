import Link from 'next/link'
import { Users, Calendar, Hash, Crown } from 'lucide-react'

export function SidebarNavigation() {
    const navItems = [
        { name: 'Groups', href: '/groups', icon: Users },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Followed Hashtags', href: '/hashtags', icon: Hash },
        { name: 'Premium', href: '/premium', icon: Crown },
    ]

    return (
        <nav className="space-y-1 px-1">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 py-1.5 w-full text-left group"
                >
                    <item.icon size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[14px] font-semibold text-blue-500 hover:underline transition-all">
                        {item.name}
                    </span>
                </Link>
            ))}
            <Link
                href="/discover"
                className="w-full mt-4 text-[14px] font-bold text-blue-500 bg-blue-50/50 hover:bg-blue-50 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-2 group shadow-sm active:scale-[0.98]"
            >
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                    N
                </div>
                Discover more
            </Link>
        </nav>
    )
}
