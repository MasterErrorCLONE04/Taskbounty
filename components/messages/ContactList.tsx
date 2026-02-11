import { Search } from 'lucide-react'

interface Contact {
    id: string
    name: string
    avatar: string
    lastMessage: string
    time: string
    isActive?: boolean
}

interface ContactListProps {
    contacts: Contact[]
    activeId?: string
    onSelect?: (id: string) => void
}

export function ContactList({ contacts, activeId, onSelect }: ContactListProps) {
    return (
        <div className="w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-white h-full">
            <div className="p-6 pb-4">
                <h1 className="text-xl font-bold text-slate-900">Messages</h1>
            </div>

            <div className="px-6 pb-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search messages"
                        className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {contacts.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                        No conversations yet.
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => onSelect?.(contact.id)}
                            className={`p-4 flex gap-3 cursor-pointer border-l-4 transition-all hover:bg-slate-50 ${contact.id === activeId || contact.isActive ? 'border-blue-500 bg-slate-50' : 'border-transparent'
                                }`}
                        >
                            <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[14px] text-slate-900 truncate">{contact.name}</h3>
                                    <span className="text-[12px] text-slate-400 font-medium">{contact.time}</span>
                                </div>
                                <p className="text-[13px] text-slate-500 truncate leading-tight">
                                    {contact.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
