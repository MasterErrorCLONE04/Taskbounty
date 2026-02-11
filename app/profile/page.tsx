
import { createClient } from '@/lib/supabase/server'
import { getRightSidebarData } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { ProfileView } from '@/components/profile/ProfileView'

export default async function ProfilePage() {
    const supabase = await createClient()
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return (
                <div className="h-screen flex items-center justify-center bg-white">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                        <p className="text-slate-500">Please log in to view this page.</p>
                    </div>
                </div>
            )
        }

        // Fetch public profile to get the latest avatar
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        // Fetch Sidebar Data
        const sidebarData = await getRightSidebarData()

        return (
            <div className="h-screen bg-white flex flex-col overflow-hidden">
                <TopNavbar user={user} profile={profile} />

                <div className="flex-1 flex justify-center overflow-hidden bg-white">
                    {/* Center Feed */}
                    <main className="flex-1 max-w-4xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                        <ProfileView />
                    </main>

                    {/* Right Sidebar */}
                    <RightSidebar
                        user={user}
                        balance={sidebarData?.balance}
                        collaborators={sidebarData?.collaborators}
                        suggestedBounties={sidebarData?.suggestedBounties}
                        whoToFollow={sidebarData?.whoToFollow}
                    />
                </div>
            </div>
        )
    } catch (error) {
        console.error('Profile Page Error:', error)
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="text-center p-6 max-w-md">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Network Error</h2>
                    <p className="text-slate-500 mb-6">Failed to load profile data. This might be due to a connection issue.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }
}
