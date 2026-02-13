import { createClient } from '@/lib/supabase/server';
import { getProfile, getRightSidebarData } from '@/actions/profile';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { ExploreTasksContent } from '@/components/tasks/ExploreTasksContent';

export default async function ExploreTasksPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const profile = user ? await getProfile(user.id) : null;
    const sidebarData = await getRightSidebarData();

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* Left Sidebar - Navigation */}
                <LeftSidebar user={profile || user} />

                {/* Center Feed */}
                <main className="flex-1 max-w-4xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    <ExploreTasksContent />
                </main>

                {/* Right Sidebar - Widgets */}
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
