
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { MessagesInterface } from '@/components/messages/MessagesInterface'

export default async function MessagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden bg-white">
                {/* Messages Content - Centered with max-width */}
                <main className="flex-1 max-w-7xl h-full border-x border-slate-50 overflow-hidden">
                    <MessagesInterface />
                </main>
            </div>
        </div>
    )
}
