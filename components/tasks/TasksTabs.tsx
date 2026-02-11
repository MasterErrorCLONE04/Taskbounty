
interface TasksTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
    counts?: { [key: string]: number }
}

export function TasksTabs({ activeTab, onTabChange, counts }: TasksTabsProps) {
    const tabs = [
        { name: 'Active', count: counts?.['Active'] || 0 },
        { name: 'Pending', count: counts?.['Pending'] || 0 },
        { name: 'Completed', count: counts?.['Completed'] || 0 },
        { name: 'Disputed', count: counts?.['Disputed'] || 0 }
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
