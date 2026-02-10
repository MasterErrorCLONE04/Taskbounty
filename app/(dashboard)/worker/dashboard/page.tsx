import React from 'react';
import { createClient } from '@/lib/supabase/server';
import UserProfileSidebar from '@/components/dashboard/UserProfileSidebar';
import HomeFeed from '@/components/dashboard/HomeFeed';
import { AccountOverview, TopEarners, TrendingSkills } from '@/components/dashboard/RightSidebarWidgets';

export default async function WorkerDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user profile
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

    // Fetch OPEN tasks for the feed (Social feel)
    const { data: recentTasks } = await supabase
        .from('tasks')
        .select('*, client:users!client_id(name, avatar_url)')
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })
        .limit(10);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Profile (3/12) */}
            <aside className="lg:col-span-3 hidden lg:block">
                <UserProfileSidebar user={user} profile={profile} />
            </aside>

            {/* Center Column: Feed (6/12) */}
            <main className="lg:col-span-6 space-y-4">
                <HomeFeed user={user} tasks={recentTasks || []} />
            </main>

            {/* Right Column: Widgets (3/12) */}
            <aside className="lg:col-span-3 space-y-4 hidden lg:block">
                <AccountOverview />
                <TopEarners />
                <TrendingSkills />
            </aside>
        </div>
    );
}
