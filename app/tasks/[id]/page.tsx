import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { getComments } from '@/actions/social'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { BountyCard } from '@/components/feed/BountyCard'
import { CommentSection } from '@/components/tasks/CommentSection'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface TaskDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null

    // Fetch task
    const { data: task, error } = await supabase
        .from('tasks')
        .select(`
            *,
            client:users!client_id(id, name, avatar_url, bio, role),
            likes(count),
            comments(count)
        `)
        .eq('id', id)
        .single()

    if (error || !task) {
        notFound()
    }

    // Check if liked
    let isLiked = false
    if (user) {
        const { data: like } = await supabase
            .from('likes')
            .select('id')
            .match({ task_id: id, user_id: user.id })
            .single()
        isLiked = !!like
    }

    // Fetch comments
    const comments = await getComments(id) || []

    // Enrich task for BountyCard
    const enrichedTask = {
        ...task,
        likes_count: task.likes?.[0]?.count || 0,
        comments_count: task.comments?.[0]?.count || 0,
        is_liked: isLiked
    }

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-lg font-black text-slate-900">Task Details</h1>
                    </div>

                    <div className="pb-20">
                        {/* We reuse BountyCard for the main look, but in a detail page context */}
                        <div className="border-b border-slate-100">
                            <BountyCard task={enrichedTask} />
                        </div>

                        <div className="p-6">
                            <CommentSection
                                taskId={id}
                                initialComments={comments as any[]}
                                currentUser={profile || user}
                            />
                        </div>
                    </div>
                </main>

                <RightSidebar user={profile || user} />
            </div>
        </div>
    )
}
