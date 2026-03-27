import { createClient } from '@/lib/supabase/server'
import { getProfile, getRightSidebarData } from '@/actions/profile'
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
    const sidebarData = await getRightSidebarData()

    // Fetch tasks created by the user or assigned to the user
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
            *,
            client:users!client_id(name, avatar_url),
            worker:users!assigned_worker_id(name, avatar_url)
        `)
        .or(`client_id.eq.${user.id},assigned_worker_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching tasks:', error)
    }

    // Map tasks to TaskItemProps
    const formattedTasks: TaskItemProps[] = (tasks || []).map((t: any) => {
        const isClient = t.client_id === user.id;

        return {
            id: t.id,
            taskId: `#BT-${t.id.slice(0, 4).toUpperCase()}`,
            status: t.status,
            title: t.title,
            personType: isClient ? 'Hunter' : 'Client',
            personName: isClient 
                ? (t.worker?.name || 'Waiting for Applicants') 
                : (t.client?.name || 'Unknown Client'),
            personAvatar: isClient 
                ? (t.worker?.avatar_url || '') 
                : (t.client?.avatar_url || ''),
            amount: t.bounty_amount,
            currency: t.currency || 'USD',
            escrowActive: ['IN_PROGRESS', 'ASSIGNED', 'SUBMITTED', 'DISPUTED'].includes(t.status),
            actions: ['View Details']
        };
    })

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar user={profile || user} sidebarData={sidebarData} />

                {/* Center Feed */}
                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar">
                    <TasksFeed tasks={formattedTasks} />
                </main>

                {/* Right Sidebar */}
                <RightSidebar
                    user={profile || user}
                    balance={sidebarData?.balance}
                    collaborators={sidebarData?.collaborators}
                    suggestedBounties={sidebarData?.suggestedBounties}
                    whoToFollow={sidebarData?.whoToFollow}
                />
            </div>
        </div>
    )
}
