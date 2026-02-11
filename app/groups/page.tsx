import { createClient } from '@/lib/supabase/server';
import { getProfile, getRightSidebarData } from '@/actions/profile';
import { getGroups } from '@/actions/groups';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { GroupCard } from '@/components/groups/GroupCard';
import { CreateGroupButton } from '@/components/groups/CreateGroupButton';

export default async function GroupsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const profile = user ? await getProfile(user.id) : null;
    const sidebarData = await getRightSidebarData();
    const groups = await getGroups();

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden bg-white">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    <div className="p-8 pb-32">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900">Groups</h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Join communities to collaborate and grow.
                                </p>
                            </div>
                            <CreateGroupButton />
                        </div>

                        {groups.length === 0 ? (
                            <div className="mt-12 text-center p-12 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                                <div className="w-16 h-16 bg-white text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2">No groups yet</h2>
                                <p className="text-slate-500 max-w-xs mx-auto mb-6">
                                    Be the first to start a community! Create a group to gather like-minded people.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {groups.map((group: any) => (
                                    <GroupCard key={group.id} group={group} />
                                ))}
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
    );
}
