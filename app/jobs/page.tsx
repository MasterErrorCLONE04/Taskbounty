
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { JobsFeed } from '@/components/jobs/JobsFeed'

export default async function JobsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar user={profile || user} />

                {/* Center Feed */}
                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                    <JobsFeed />
                </main>

                {/* Right Sidebar */}
                <RightSidebar user={profile || user} />
            </div>
        </div>
    )
}
