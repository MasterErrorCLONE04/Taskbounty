import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
    ArrowLeft,
    ShieldCheck,
    Clock,
    FileText,
    ListChecks,
    MessageSquare,
    AlertCircle,
    Settings,
    Briefcase
} from 'lucide-react'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Fetch task details
    const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !task) {
        console.error('TaskDetail Fetch Error:', fetchError)
        console.error('Task ID attempted:', id)
        notFound()
    }

    // 1.1 Fetch client details separately to handle missing user profiles gracefully
    const { data: client } = await supabase
        .from('users')
        .select('name, rating')
        .eq('id', task.client_id)
        .single()

    // 2. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null
    const isOwner = user?.id === task.client_id
    const userRole = user?.user_metadata?.role

    // 3. Fetch applications count
    const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('task_id', id)

    const deadlineDate = new Date(task.deadline)
    const now = new Date()
    const diffTime = Math.abs(deadlineDate.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-5xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-white">
                    <div className="min-h-screen pb-20">
                        {/* Top Navigation */}
                        <nav className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                            <div className="flex items-center justify-between">
                                <Link href="/tasks/explore" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors group">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Volver al explorador
                                </Link>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    <span className="font-bold text-sm text-slate-700">Escrow Protegido</span>
                                </div>
                            </div>
                        </nav>

                        <div className="px-6 py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-8">
                                    <header>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${task.status === 'OPEN' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-blue-600/10 text-blue-600 border border-blue-600/20'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl font-black tracking-tight mb-4 text-slate-900">
                                            {task.title}
                                        </h1>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <span className="text-sm font-medium">Publicado por</span>
                                                <span className="text-slate-900 font-bold">{client?.name || 'Cliente'}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                ★ {client?.rating || '0.0'}
                                            </div>
                                        </div>
                                    </header>

                                    <section className="space-y-3">
                                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            Descripción
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">
                                            {task.description}
                                        </p>
                                    </section>

                                    <section className="space-y-3">
                                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                            <ListChecks className="w-5 h-5 text-blue-500" />
                                            Requisitos
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                            <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-sm">
                                                {task.requirements}
                                            </pre>
                                        </div>
                                    </section>
                                </div>

                                {/* Sidebar / Actions */}
                                <div className="space-y-6">
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 sticky top-24">
                                        <div className="mb-6">
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">Bounty Ofrecido</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-slate-900">${task.bounty_amount}</span>
                                                <span className="text-slate-500 font-bold text-sm">USD</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 flex items-center gap-2 font-medium">
                                                    <Clock className="w-4 h-4" /> Tiempo restante
                                                </span>
                                                <span className="font-bold text-slate-700">{diffDays} días</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 flex items-center gap-2 font-medium">
                                                    <MessageSquare className="w-4 h-4" /> Aplicaciones
                                                </span>
                                                <span className="font-bold text-slate-700">{appCount} recibidas</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {isOwner ? (
                                                <Link
                                                    href={`/tasks/${id}/manage`}
                                                    className="w-full bg-slate-900 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Gestionar Tarea
                                                </Link>
                                            ) : userRole === 'worker' || userRole === 'both' ? (
                                                task.status === 'OPEN' ? (
                                                    <Link
                                                        href={`/tasks/${id}/apply`}
                                                        className="w-full bg-blue-600 text-white h-12 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                                                    >
                                                        Aplicar ahora
                                                    </Link>
                                                ) : task.assigned_worker_id === user?.id ? (
                                                    <Link
                                                        href={`/tasks/${id}/work`}
                                                        className="w-full bg-blue-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                                                    >
                                                        <Briefcase className="w-4 h-4" />
                                                        Ir a sala de trabajo
                                                    </Link>
                                                ) : (
                                                    <button className="w-full bg-slate-100 text-slate-400 h-12 rounded-xl font-bold cursor-not-allowed">
                                                        Ya no acepta aplicaciones
                                                    </button>
                                                )
                                            ) : !user ? (
                                                <Link
                                                    href="/login"
                                                    className="w-full bg-blue-600 text-white h-12 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                                                >
                                                    Ingresa para aplicar
                                                </Link>
                                            ) : null}

                                            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] leading-tight text-slate-500">
                                                <AlertCircle className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                                                Al aplicar, aceptas nuestros términos de servicio y política de escrow.
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                                <div className="text-[10px] font-bold leading-normal">
                                                    PAGO GARANTIZADO: Este bounty ya ha sido depositado en escrow por el cliente.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <RightSidebar user={profile || user} />
            </div>
        </div>
    )
}
