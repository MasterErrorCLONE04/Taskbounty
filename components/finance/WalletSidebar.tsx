'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, Banknote, Settings, ChevronRight } from 'lucide-react'

export function WalletSidebar() {
    const pathname = usePathname()

    const navItems: { label: string; href: string; icon: any; disabled?: boolean }[] = [
        {
            label: 'Wallet Overview',
            href: '/wallet',
            icon: Wallet
        },
        {
            label: 'Withdraw Funds',
            href: '/wallet/withdraw',
            icon: Banknote
        },
        {
            label: 'Payment Settings',
            href: '/wallet/settings',
            icon: Settings
        }
    ]

    return (
        <div className="w-full lg:w-64 shrink-0">
            <div className="space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    if (item.disabled) {
                        return (
                            <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 cursor-not-allowed mx-2">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    <span className="font-bold text-[15px]">{item.label}</span>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all mx-2 ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                                <span className="font-bold text-[15px]">{item.label}</span>
                            </div>
                            {/* {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />} */}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
