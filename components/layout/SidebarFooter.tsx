import Link from 'next/link'

export function SidebarFooter() {
    const currentYear = new Date().getFullYear()

    const links = [
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Cookies', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Ads Info', href: '/ads-info' },
    ]

    return (
        <footer className="mt-6 px-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-slate-400 font-medium">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="hover:underline hover:text-slate-600 transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
                <span className="text-slate-300">© {currentYear} TaskBounty Corp.</span>
            </div>
        </footer>
    )
}
