import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { IncreasePayTaskView } from '@/components/tasks/IncreasePayTaskView'

export default async function IncreaseBountyPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const { redirect } = await import('next/navigation')
        redirect('/?login=true')
        return null
    }

    const { data: task } = await supabase.from('tasks').select('client_id, status').eq('id', id).single()
    if (!task || task.client_id !== user.id || task.status === 'COMPLETED' || task.status === 'CANCELLED') {
        const { redirect } = await import('next/navigation')
        redirect(`/tasks/${id}/manage`)
        return null
    }

    const profile = await getProfile(user.id)

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden bg-slate-50/30">
                <main className="w-full max-w-4xl h-full overflow-y-auto no-scrollbar bg-white border-x border-slate-100 shadow-sm shadow-slate-100/50">
                    <IncreasePayTaskView taskId={id} />
                </main>
            </div>
        </div>
    )
}
