
import { createClient } from '@/lib/supabase/server'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { ProfileView } from '@/components/profile/ProfileView'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} />

            <div className="flex-1 flex justify-center overflow-hidden bg-white">
                {/* Center Feed */}
                <main className="flex-1 max-w-4xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                    <ProfileView />
                </main>

                {/* Right Sidebar */}
                <RightSidebar user={user} />
            </div>
        </div>
    )
}
