import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { TasksFeed } from '@/components/tasks/TasksFeed'
import { redirect } from 'next/navigation'
import { TaskItemProps } from '@/components/tasks/TaskCard'

export default async function TasksPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/?login=true')

    const profile = await getProfile(user.id)

    // Fetch assigned tasks (My Work)
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
            *,
            client:users!client_id(name, avatar_url)
        `)
        .eq('assigned_worker_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching tasks:', error)
    }

    // Map tasks to TaskItemProps
    const formattedTasks: TaskItemProps[] = (tasks || []).map((t: any) => ({
        id: t.id,
        taskId: `#BT-${t.id.slice(0, 4).toUpperCase()}`,
        status: t.status,
        title: t.title,
        personType: 'Client',
        personName: t.client?.name || 'Unknown Client',
        personAvatar: t.client?.avatar_url || '',
        amount: t.bounty_amount,
        currency: t.currency || 'USD',
        escrowActive: ['IN_PROGRESS', 'ASSIGNED', 'SUBMITTED', 'DISPUTED'].includes(t.status),
        actions: ['View Details'] // Placeholder, actions could be dynamic based on status
    }))

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar user={profile || user} />

                {/* Center Feed */}
                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                    <TasksFeed tasks={formattedTasks} />
                </main>

                {/* Right Sidebar */}
                <RightSidebar user={profile || user} />
            </div>
        </div>
    )
}
