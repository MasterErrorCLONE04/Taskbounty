import { Search, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface Contact {
    id: string
    name: string
    avatar: string
    lastMessage: string
    time: string
    isActive?: boolean
    otherUserId?: string
}

interface ContactListProps {
    contacts: Contact[]
    activeId?: string
    onSelect?: (id: string) => void
    onlineUsers?: Set<string>
    isCollapsed?: boolean
    onToggleCollapse?: () => void
}

export function ContactList({
    contacts,
    activeId,
    onSelect,
    onlineUsers = new Set(),
    isCollapsed = false,
    onToggleCollapse
}: ContactListProps) {
    return (
        <div className={`border-r border-slate-100 flex flex-col bg-white h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-full md:w-[380px]'}`}>
            <div className={`p-6 pb-4 flex items-center justify-between ${isCollapsed ? 'px-4 flex-col gap-4' : 'px-6'}`}>
                {!isCollapsed && <h1 className="text-xl font-bold text-slate-900">Messages</h1>}
                <button
                    onClick={onToggleCollapse}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>

            <div className={`pb-6 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden px-0' : 'px-6 opacity-100 h-14'}`}>
                {!isCollapsed && (
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                        />
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {contacts.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                        {!isCollapsed && "No conversations yet."}
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => onSelect?.(contact.id)}
                            className={`flex gap-3 cursor-pointer border-l-4 transition-all hover:bg-slate-50 ${isCollapsed ? 'p-4 justify-center' : 'p-4'} ${contact.id === activeId || contact.isActive ? 'border-blue-500 bg-slate-50' : 'border-transparent'
                                }`}
                            title={isCollapsed ? contact.name : undefined}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover shadow-sm transition-transform group-hover:scale-105" />
                                {contact.otherUserId && onlineUsers.has(contact.otherUserId) && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full ring-2 ring-green-500/10"></div>
                                )}
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 overflow-hidden transition-all duration-300">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-bold text-[14px] text-slate-900 truncate">{contact.name}</h3>
                                        <span className="text-[12px] text-slate-400 font-medium">{contact.time}</span>
                                    </div>
                                    <p className="text-[13px] text-slate-500 truncate leading-tight">
                                        {contact.lastMessage}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
