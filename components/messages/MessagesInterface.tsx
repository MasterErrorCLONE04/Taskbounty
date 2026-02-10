
"use client"

import { ContactList } from "@/components/messages/ContactList"
import { ChatWindow } from "@/components/messages/ChatWindow"

export function MessagesInterface() {
    const contacts = [
        {
            id: 'c1',
            name: 'Marcus Chen',
            avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=random',
            lastMessage: "I've just approved the escrow for the React...",
            time: '2h',
            isActive: true
        },
        {
            id: 'c2',
            name: 'Sarah Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
            lastMessage: "The figma files are ready for your review.",
            time: '5h'
        },
        {
            id: 'c3',
            name: 'Leo V.',
            avatar: 'https://ui-avatars.com/api/?name=Leo+V&background=random',
            lastMessage: "Thanks for the quick payment! Great working...",
            time: 'Oct 24'
        },
        {
            id: 'c4',
            name: 'Mia Wong',
            avatar: 'https://ui-avatars.com/api/?name=Mia+Wong&background=random',
            lastMessage: "Are you still looking for a copywriter?",
            time: 'Oct 22'
        }
    ]

    return (
        <div className="flex h-full bg-white overflow-hidden">
            <ContactList contacts={contacts} activeId="c1" />
            <ChatWindow />
        </div>
    )
}
