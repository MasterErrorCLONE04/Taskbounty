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
import {
    ArrowLeft,
    ShieldCheck,
    FileText,
    CheckCircle2,
    Clock,
    Users,
    Info,
    Trophy,
    Briefcase
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

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
            comments(count),
            applications(count)
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

    // Check if applied
    let myApplication = null
    if (user) {
        const { data: application } = await supabase
            .from('applications')
            .select('id, status')
            .match({ task_id: id, worker_id: user.id })
            .single()
        myApplication = application
    }

    // Fetch comments
    const comments = await getComments(id) || []

    // Enrich task for BountyCard
    const enrichedTask = {
        ...task,
        likes_count: task.likes?.[0]?.count || 0,
        comments_count: task.comments?.[0]?.count || 0,
        applications_count: task.applications?.[0]?.count || 0,
        is_liked: isLiked
    }

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-6xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    {/* Header Nav */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Volver al explorador
                        </Link>
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <ShieldCheck size={14} className="fill-green-600 text-white" />
                            <span className="text-[11px] font-black uppercase tracking-wide">Escrow Protegido</span>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
                        {/* LEFT COLUMN: Details */}
                        <div className="lg:col-span-8 space-y-8">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
                                    {task.status}
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{task.title}</h1>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-slate-500 font-medium">Publicado por</span>
                                    <span className="font-bold text-slate-900">{task.client?.name || 'Cliente'}</span>
                                    {task.client?.rating && (
                                        <span className="flex items-center text-orange-400 font-bold text-xs">
                                            ★ {task.client.rating}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                        <FileText size={20} />
                                    </div>
                                    <h2>Descripción</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]">
                                    {task.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <h2>Requisitos</h2>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-[15px]">
                                    {task.requirements || 'No especificados'}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    Comentarios <span className="text-slate-400 font-medium text-sm">({comments.length})</span>
                                </h3>
                                <CommentSection
                                    taskId={id}
                                    initialComments={comments as any[]} // Type assertion for now
                                    currentUser={profile || user}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sticky Bounty Card */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100%] rounded-tr-[2rem] -z-0"></div>

                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 relative z-10">Bounty Ofrecido</p>
                                    <div className="flex items-baseline gap-1 mb-6 relative z-10">
                                        <span className="text-5xl font-black text-slate-900 tracking-tight">${task.bounty_amount}</span>
                                        <span className="text-sm font-bold text-slate-400 ">{task.currency}</span>
                                    </div>

                                    <div className="space-y-4 mb-8 relative z-10">
                                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <Clock size={16} />
                                                <span className="text-sm font-medium">Tiempo restante</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">
                                                {formatDistanceToNow(new Date(task.deadline), { locale: es })}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <Users size={16} />
                                                <span className="text-sm font-medium">Aplicaciones</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">
                                                {enrichedTask.applications_count || 0} recibidas
                                            </span>
                                        </div>
                                    </div>

                                    {user?.id === task.client_id ? (
                                        <Link
                                            href={`/tasks/${id}/manage`}
                                            className="w-full block text-center py-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 mb-4"
                                        >
                                            Gestionar Tarea
                                        </Link>
                                    ) : myApplication?.status === 'accepted' ? (
                                        <div className="space-y-3 mb-4">
                                            <div className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-green-50 text-green-600 font-bold text-sm border border-green-100">
                                                <Trophy size={18} />
                                                ¡Seleccionado!
                                            </div>
                                            <Link
                                                href={`/tasks/${id}/work`}
                                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                                            >
                                                <Briefcase size={18} />
                                                Ir a Sala de trabajo
                                            </Link>
                                        </div>
                                    ) : myApplication ? (
                                        <div className="space-y-3 mb-4">
                                            <button
                                                disabled
                                                className="w-full block text-center py-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed"
                                            >
                                                Ya aplicaste
                                            </button>
                                            <Link
                                                href="/my-applications"
                                                className="block text-center text-[13px] font-bold text-blue-500 hover:underline"
                                            >
                                                Ver mi aplicación
                                            </Link>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/tasks/${id}/apply`}
                                            className="w-full block text-center py-4 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 active:scale-95 mb-4"
                                        >
                                            Aplicar ahora
                                        </Link>
                                    )}

                                    <div className="p-3 bg-blue-50 rounded-xl flex items-start gap-3">
                                        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-[11px] text-blue-600/80 font-medium leading-relaxed">
                                            Al aplicar, aceptas nuestros términos de servicio y política de escrow.
                                        </p>
                                    </div>
                                </div>

                                {/* Guarantee Badge */}
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
                                        <ShieldCheck size={18} className="fill-green-600 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase text-green-700 tracking-wider mb-1">Pago Garantizado</h4>
                                        <p className="text-[11px] text-green-600/80 font-medium leading-relaxed">
                                            Este bounty ya ha sido depositado en escrow por el cliente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
