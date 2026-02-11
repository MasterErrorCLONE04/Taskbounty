import { createClient } from '@/lib/supabase/server';
import { getRecentOpenTasks } from '@/actions/tasks';
import { getProfile, getRightSidebarData } from '@/actions/profile';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { HomeHero } from '@/components/feed/HomeHero';
import { CreateBountyCard } from '@/components/feed/CreateBountyCard';
import { BountyCard } from '@/components/feed/BountyCard';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfile(user.id) : null;
  const recentTasks = await getRecentOpenTasks();
  const sidebarData = await getRightSidebarData();

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <TopNavbar user={user} profile={profile} />

      <div className="flex-1 flex justify-center overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <LeftSidebar user={profile || user} />

        {/* Center Feed */}
        <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-slate-50/50">
          {user ? <CreateBountyCard user={profile || user} /> : <HomeHero />}

          <div className="divide-y divide-slate-50 pb-20">
            {recentTasks?.map((task) => (
              <BountyCard key={task.id} task={task as any} currentUser={profile || user} />
            ))}

            {(!recentTasks || recentTasks.length === 0) && (
              <div className="p-12 text-center">
                <p className="text-slate-400 font-medium">No active bounties found. Be the first to post one!</p>
              </div>
            )}
          </div>
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
