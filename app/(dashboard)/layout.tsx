import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TopNavbar from '@/components/dashboard/TopNavbar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch public profile to get the latest avatar
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Top Navigation */}
            <TopNavbar user={user} profile={profile} />

            {/* Main Content Area - Centered for the professional look */}
            <div className="pt-16 max-w-7xl mx-auto px-4 md:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
