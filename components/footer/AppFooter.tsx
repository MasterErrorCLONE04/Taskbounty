
export function AppFooter() {
    return (
        <footer className="px-1 py-4">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-slate-400 font-medium">
                {['Terms', 'Privacy', 'Cookies', 'Accessibility', 'Ads Info'].map(text => (
                    <a key={text} href="#" className="hover:underline">{text}</a>
                ))}
                <span className="text-slate-300">© 2024 TaskBounty Corp.</span>
            </div>
        </footer>
    )
}
