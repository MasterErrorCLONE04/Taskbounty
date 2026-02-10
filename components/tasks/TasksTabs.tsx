
interface TasksTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function TasksTabs({ activeTab, onTabChange }: TasksTabsProps) {
    const tabs = [
        { name: 'Active', count: 3 },
        { name: 'Pending', count: 1 },
        { name: 'Completed', count: 12 },
        { name: 'Disputed', count: 0 }
    ]

    return (
        <div className="flex border-b border-slate-100 px-4">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => onTabChange(tab.name)}
                    className={`flex-1 py-3 text-[13px] font-bold transition-all relative ${activeTab === tab.name ? 'text-blue-500' : 'text-slate-500 hover:text-slate-900'
                        }`}
                >
                    {tab.name} ({tab.count})
                    {activeTab === tab.name && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />}
                </button>
            ))}
        </div>
    )
}
