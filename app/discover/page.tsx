import { createClient } from '@/lib/supabase/server';
import { getProfile, getRightSidebarData } from '@/actions/profile';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';

export default async function DiscoverPage() {
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
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Discover More</h1>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Explore new opportunities, communities, and content tailored to your professional interests.
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
