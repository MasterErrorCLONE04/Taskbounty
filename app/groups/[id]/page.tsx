import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { getProfile, getRightSidebarData } from '@/actions/profile'
import { checkMembership } from '@/actions/groups'
import { JoinGroupButton } from '@/components/groups/JoinGroupButton'
import { Lock } from 'lucide-react'

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null
    const sidebarData = await getRightSidebarData()

    const { data: group } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

    if (!group) {
        return notFound()
    }

    const isMember = await checkMembership(id)

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden bg-white">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    <div className="relative h-48 bg-slate-100">
                        {group.banner_url && (
                            <img src={group.banner_url} alt="Cover" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                <img
                                    src={group.avatar_url || "https://ui-avatars.com/api/?name=" + group.name}
                                    alt={group.name}
                                    className="w-full h-full rounded-xl object-cover bg-slate-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 px-8 pb-32">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">{group.name}</h1>
                                <p className="text-slate-500 mt-2 text-lg">{group.description}</p>
                            </div>
                            <JoinGroupButton groupId={group.id} initialIsMember={isMember} />
                        </div>

                        {isMember ? (
                            <div className="mt-8">
                                <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50 text-center">
                                    <h3 className="text-lg font-bold text-slate-900">Group Feed</h3>
                                    <p className="text-slate-500">Posts and discussions coming soon...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-12 text-center p-12 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                                <div className="w-16 h-16 bg-white text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Lock size={32} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2">Members only</h2>
                                <p className="text-slate-500 max-w-xs mx-auto mb-6">
                                    Join this group to view posts and participate in discussions.
                                </p>
                            </div>
                        )}
                    </div>
                </main>

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
