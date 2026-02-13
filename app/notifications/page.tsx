
import { createClient } from '@/lib/supabase/server'
import { getProfile, getRightSidebarData } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { NotificationsFeed } from '@/components/notifications/NotificationsFeed'
import { getNotifications } from '@/actions/notifications'

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null
    const notifications = await getNotifications()
    const sidebarData = await getRightSidebarData()

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar user={profile || user} />

                {/* Center Feed */}
                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                    <NotificationsFeed initialNotifications={notifications} />
                </main>

                {/* Right Sidebar */}
                <RightSidebar
                    user={profile || user}
                    balance={sidebarData?.balance}
                    collaborators={sidebarData?.collaborators}
                    suggestedBounties={sidebarData?.suggestedBounties}
                    whoToFollow={sidebarData?.whoToFollow}
                />
            </div>
        </div>
    )
}
