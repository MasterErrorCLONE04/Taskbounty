
"use client"

import { useState } from 'react'
import { CheckCircle2, CreditCard, Star, Megaphone } from 'lucide-react'
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader"
import { NotificationsTabs } from "@/components/notifications/NotificationsTabs"
import { NotificationItem, Notification } from "@/components/notifications/NotificationItem"

export function NotificationsFeed() {
    const [activeTab, setActiveTab] = useState('All')

    const notifications: Notification[] = [
        {
            id: 1,
            type: 'proposal',
            user: { name: 'Marcus Chen', avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=random' },
            content: 'accepted your proposal for <span class="text-blue-500 cursor-pointer hover:underline font-bold">React Architect</span>. You can now start the work.',
            time: '2m ago',
            unread: true,
            icon: <CheckCircle2 size={16} className="text-white" />,
            iconBg: 'bg-green-500'
        },
        {
            id: 2,
            type: 'offer',
            user: { name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random' },
            content: 'You received a direct offer of <span class="font-bold text-slate-900">$250 USDC</span> from <span class="font-bold text-slate-900">Sarah Johnson</span> for a private consulting session.',
            time: '45m ago',
            unread: true,
            hasActions: true,
            icon: <CreditCard size={16} className="text-white" />,
            iconBg: 'bg-blue-500'
        },
        {
            id: 3,
            type: 'milestone',
            content: '<span class="font-bold text-slate-900">Reputation milestone:</span> You reached <span class="text-orange-500 font-bold">4.98!</span> This puts you in the top 2% of developers this month.',
            time: '3h ago',
            icon: <Star size={16} className="text-white" />,
            iconBg: 'bg-yellow-500'
        },
        {
            id: 4,
            type: 'match',
            content: 'A new bounty matching your skills was posted: <span class="font-bold text-slate-900">Rust Backend Optimization</span> ($800 USDC).',
            time: '5h ago',
            icon: <Megaphone size={16} className="text-white" />,
            iconBg: 'bg-slate-200'
        },
        {
            id: 5,
            type: 'comment',
            user: { name: 'David Wu', avatar: 'https://ui-avatars.com/api/?name=David+Wu&background=random' },
            content: '<span class="font-bold text-slate-900">David Wu</span> mentioned you in a comment: "@alex_rivest could you take a look at the PR for the dashboard?"',
            quote: '"Excellent work on the previous module, I think you\'re the best fit for this..."',
            time: 'Yesterday',
        }
    ]

    return (
        <div className="flex flex-col min-h-full pb-20">
            <NotificationsHeader />
            <NotificationsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1">
                {notifications.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} />
                ))}
            </div>

            <div className="p-12 text-center text-slate-400 font-medium text-[14px]">
                You're all caught up!
            </div>
        </div>
    )
}
