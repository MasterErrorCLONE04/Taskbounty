
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { PayTaskView } from '@/components/tasks/PayTaskView'

export default async function PayTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-7xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    <PayTaskView taskId={id} />
                </main>

                <RightSidebar user={profile || user} />
            </div>
        </div>
    )
}
