import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/dashboard/Sidebar';
import { redirect } from 'next/navigation';

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

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            {/* Sidebar - Fixed on desktop, hidden on mobile (handled in component) */}
            <Sidebar user={user} />

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-72">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
