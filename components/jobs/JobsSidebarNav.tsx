
export function JobsSidebarNav() {
    const links = ['My Jobs', 'Applied Bounties', 'Saved Tasks', 'Career Preferences']

    return (
        <nav className="space-y-1.5 px-1">
            {links.map((link) => (
                <button
                    key={link}
                    className="block text-[14px] font-semibold text-blue-500 hover:underline transition-all py-1 w-full text-left"
                >
                    {link}
                </button>
            ))}
        </nav>
    )
}
