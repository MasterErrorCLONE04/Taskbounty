
import { createClient } from '@/lib/supabase/server'
import { getRightSidebarData, getPublicProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { ProfileView } from '@/components/profile/ProfileView'
import { notFound } from 'next/navigation'

export default async function PublicProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // 1. Fetch Target Public Profile
    const publicProfile = await getPublicProfile(params.id)

    if (!publicProfile) {
        return notFound()
    }

    // 2. Fetch Current User's Profile (for TopNavbar avatar)
    let currentUserProfile = null
    if (currentUser) {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single()
        currentUserProfile = data
    }

    // 3. Fetch Sidebar Data (Contextual to the viewer)
    const sidebarData = await getRightSidebarData()

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={currentUser} profile={currentUserProfile} />

            <div className="flex-1 flex justify-center overflow-hidden bg-white">
                {/* Center Feed */}
                <main className="flex-1 max-w-4xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                    <ProfileView initialUser={publicProfile} />
                </main>

                {/* Right Sidebar */}
                <RightSidebar
                    user={currentUser}
                    balance={sidebarData?.balance}
                    collaborators={sidebarData?.collaborators}
                    suggestedBounties={sidebarData?.suggestedBounties}
                    whoToFollow={sidebarData?.whoToFollow}
                />
            </div>
        </div>
    )
}
