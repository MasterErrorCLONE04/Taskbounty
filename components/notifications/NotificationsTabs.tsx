
interface NotificationsTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function NotificationsTabs({ activeTab, onTabChange }: NotificationsTabsProps) {
    return (
        <div className="flex px-6 border-b border-slate-50 bg-white">
            {['All', 'Mentions', 'Bounties'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`flex-1 py-4 text-[14px] font-bold relative transition-all ${activeTab === tab ? 'text-blue-500' : 'text-slate-500 hover:text-slate-900'
                        }`}
                >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />}
                </button>
            ))}
        </div>
    )
}
