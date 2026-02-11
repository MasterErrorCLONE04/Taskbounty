import { createClient } from '@/lib/supabase/server';
import { getProfile, getRightSidebarData } from '@/actions/profile';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';

export default async function GroupsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const profile = user ? await getProfile(user.id) : null;
    const sidebarData = await getRightSidebarData();

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden bg-white">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    <div className="p-8 text-center mt-20">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Groups</h1>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Join professional groups to collaborate, share resources, and grow your network.
                        </p>
                        <div className="mt-8 p-12 border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400 font-medium">Coming Soon</p>
                        </div>
                    </div>
                </main>

                <RightSidebar user={profile || user} balance={sidebarData?.balance} collaborators={sidebarData?.collaborators} suggestedBounties={sidebarData?.suggestedBounties} whoToFollow={sidebarData?.whoToFollow} />
            </div>
        </div>
    );
}
