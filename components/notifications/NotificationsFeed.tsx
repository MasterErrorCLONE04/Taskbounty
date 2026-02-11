"use client"

import { useState } from 'react'
import { CheckCircle2, CreditCard, Star, Megaphone, UserPlus, Bell, Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader"
import { NotificationsTabs } from "@/components/notifications/NotificationsTabs"
import { NotificationItem, Notification } from "@/components/notifications/NotificationItem"
import { markAsRead } from '@/actions/notifications'
import { useRouter } from 'next/navigation'

interface NotificationsFeedProps {
    initialNotifications?: any[]
}

export function NotificationsFeed({ initialNotifications = [] }: NotificationsFeedProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('All')
    const [notifications, setNotifications] = useState<any[]>(initialNotifications)

    // Helper to map icon based on type
    const getIcon = (type: string) => {
        switch (type) {
            case 'follow': return <UserPlus size={16} className="text-white" />
            case 'bounty_posted': return <Megaphone size={16} className="text-white" />
            case 'application': return <CreditCard size={16} className="text-white" />
            case 'message': return <CheckCircle2 size={16} className="text-white" />
            case 'like': return <Heart size={16} className="text-white" />
            case 'comment': return <MessageCircle size={16} className="text-white" />
            default: return <Bell size={16} className="text-white" />
        }
    }

    const getIconBg = (type: string) => {
        switch (type) {
            case 'follow': return 'bg-blue-500'
            case 'bounty_posted': return 'bg-purple-500'
            case 'application': return 'bg-green-500'
            case 'like': return 'bg-red-500'
            case 'comment': return 'bg-orange-500'
            default: return 'bg-slate-400'
        }
    }

    const mappedNotifications: Notification[] = notifications.map(n => ({
        id: n.id,
        type: n.type,
        // We don't have user object in notification table currently, so we extract from message or use generic
        // Improvement: Store actor_id in notifications table
        content: `<span class="font-bold text-slate-900">${n.title}</span>: ${n.message}`,
        time: n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : 'Just now',
        unread: !n.read,
        icon: getIcon(n.type),
        iconBg: getIconBg(n.type),
        link: n.link
    }))

    const handleNotificationClick = async (id: string | number, link?: string) => {
        // Mark as read
        await markAsRead(id.toString())

        // Update local state
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

        if (link) {
            router.push(link)
        }
    }

    const filteredNotifications = activeTab === 'All'
        ? mappedNotifications
        : mappedNotifications.filter(n => !n.unread) // Mock logic for tabs, adjust as needed

    return (
        <div className="flex flex-col min-h-full pb-20">
            <NotificationsHeader />
            <NotificationsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1">
                {mappedNotifications.length > 0 ? (
                    mappedNotifications.map((notif) => (
                        <div key={notif.id} onClick={() => handleNotificationClick(notif.id, (notif as any).link)} className="cursor-pointer">
                            <NotificationItem notif={notif} />
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-slate-400 font-medium text-[14px]">
                        No notifications yet.
                    </div>
                )}
            </div>

            {mappedNotifications.length > 0 && (
                <div className="p-12 text-center text-slate-400 font-medium text-[14px]">
                    That's all for now!
                </div>
            )}
        </div>
    )
}
