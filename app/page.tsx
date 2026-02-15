
import { createClient } from '@/lib/supabase/server';
import { getRecentOpenTasks, getFollowedTasks } from '@/actions/tasks';
import { getProfile, getRightSidebarData } from '@/actions/profile';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { HomeHero } from '@/components/feed/HomeHero';
import { CreateBountyCard } from '@/components/feed/CreateBountyCard';
import { BountyCard } from '@/components/feed/BountyCard';
import { FeedContainer } from '@/components/feed/FeedContainer';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Parallel data fetching
  const [profile, recentTasks, followedTasks] = await Promise.all([
    user ? getProfile(user.id) : null,
    getRecentOpenTasks(),
    user ? getFollowedTasks() : Promise.resolve([])
  ]);
  const sidebarData = await getRightSidebarData();

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <TopNavbar user={user} profile={profile} />

      <div className="flex-1 flex justify-center overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <LeftSidebar user={profile || user} />

        {/* Center Feed */}
        <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-slate-50/50">
          <div className="p-6">
            <FeedContainer
              user={profile || user}
              tasks={recentTasks || []}
              followedTasks={followedTasks || []}
            />
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
