
import { createClient } from '@/lib/supabase/server'
import { getRightSidebarData, getPublicProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { ProfileView } from '@/components/profile/ProfileView'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params
    const profile = await getPublicProfile(params.id)

    if (!profile) {
        return {
            title: 'Profile Not Found',
        }
    }

    return {
        title: `${profile.name} (@${profile.username || 'user'}) | TaskBounty`,
        description: profile.bio || `Check out ${profile.name}'s profile on TaskBounty.`,
        openGraph: {
            title: `${profile.name} | TaskBounty Member`,
            description: profile.bio || `Check out ${profile.name}'s profile on TaskBounty.`,
            images: [
                {
                    url: profile.avatar_url || '/default-avatar.png',
                    width: 800,
                    height: 800,
                    alt: profile.name,
                }
            ],
            type: 'profile',
        },
        twitter: {
            card: 'summary',
            title: `${profile.name} | TaskBounty Member`,
            description: profile.bio || `Check out ${profile.name}'s profile.`,
            images: [profile.avatar_url || '/default-avatar.png'],
        }
    }
}

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
