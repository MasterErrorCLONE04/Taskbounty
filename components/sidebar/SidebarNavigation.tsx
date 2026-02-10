
export function SidebarNavigation() {
    const links = ['Groups', 'Events', 'Followed Hashtags']

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
            <button className="w-full mt-4 text-[14px] font-bold text-blue-500 bg-blue-50/50 hover:bg-blue-50 py-2 rounded-xl transition-all text-center">
                Discover more
            </button>
        </nav>
    )
}
