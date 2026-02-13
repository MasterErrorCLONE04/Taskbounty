import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
    ArrowLeft,
    ShieldCheck,
    Settings,
    Users,
    DollarSign,
    Clock,
    Briefcase,
    History
} from 'lucide-react'
import ApplicationList from '@/components/tasks/ApplicationList'
import DevActivationButton from '@/components/tasks/DevActivationButton'

import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import ActivityHistory, { ActivityEvent } from '@/components/tasks/ActivityHistory'
import SettingsView from '@/components/tasks/SettingsView'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ManageTaskPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ tab?: string }>
}) {
    const supabase = await createClient()
    const { id } = await params
    const { tab = 'applicants' } = await searchParams

    const { data: { user } } = await supabase.auth.getUser()
    const profile = user ? await getProfile(user.id) : null

    // 1. Fetch task details
    const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (!task) notFound()

    // 2. Fetch applications for this task
    const { data: applications } = await supabase
        .from('applications')
        .select('*, worker:users(name, rating, avatar_url)')
        .eq('task_id', id)
        .order('created_at', { ascending: false })

    // 3. Fetch activity data
    const [{ data: payments }, { data: logs }] = await Promise.all([
        supabase.from('payments').select('*').eq('task_id', id),
        supabase.from('state_logs')
            .select('*')
            .eq('entity_id', id)
            .eq('entity_type', 'task')
            .order('created_at', { ascending: false })
    ])

    // 4. Construct activity timeline
    const activities: ActivityEvent[] = []

    // A. Task Creation
    activities.push({
        id: 'creation-' + task.id,
        type: 'creation',
        title: 'Task created by Client',
        time: formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: es }),
        date: new Date(task.created_at)
    })

    // B. Payments (Escrow)
    payments?.forEach(p => {
        if (p.payment_status === 'succeeded') {
            activities.push({
                id: 'payment-' + p.id,
                type: 'escrow',
                title: `Escrow funded with $${p.amount}`,
                time: formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: es }),
                date: new Date(p.created_at)
            })
        }
    })

    // C. Applications
    applications?.forEach(app => {
        activities.push({
            id: 'app-' + app.id,
            type: 'applicant',
            title: `New applicant: ${app.worker?.name || 'Worker'}`,
            time: formatDistanceToNow(new Date(app.created_at), { addSuffix: true, locale: es }),
            date: new Date(app.created_at)
        })
    })

    // D. State Transitions (from logs)
    logs?.forEach(log => {
        if (log.new_state === 'OPEN' && log.old_state === 'DRAFT') {
            activities.push({
                id: 'log-' + log.id,
                type: 'escrow', // Uses green theme for "Published/Funded"
                title: 'Task published to the feed',
                time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: es }),
                date: new Date(log.created_at)
            })
        }
        if (log.new_state === 'ASSIGNED') {
            activities.push({
                id: 'log-' + log.id,
                type: 'assignment',
                title: 'Task assigned and locked',
                time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: es }),
                date: new Date(log.created_at)
            })
        }
        if (log.new_state === 'SUBMITTED') {
            activities.push({
                id: 'log-' + log.id,
                type: 'delivery',
                title: 'Deliverables submitted for review',
                time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: es }),
                date: new Date(log.created_at)
            })
        }
        if (log.new_state === 'COMPLETED') {
            activities.push({
                id: 'log-' + log.id,
                type: 'completion',
                title: 'Task approved and payment released',
                time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: es }),
                date: new Date(log.created_at)
            })
        }
    })

    // Sort by date descending
    activities.sort((a, b) => b.date.getTime() - a.date.getTime())

    const isAssigned = task.status !== 'OPEN' && task.status !== 'DRAFT'

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={user} profile={profile} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* 1. Left Navigation Sidebar - Feed Style */}
                <aside className="hidden lg:flex flex-col w-64 h-full border-r border-transparent px-2 overflow-y-auto py-6 no-scrollbar">
                    <div className="px-4 mb-8">
                        <Link href="/" className="flex items-center gap-2 text-[14px] font-black text-slate-900 hover:text-blue-500 transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Volver al panel
                        </Link>
                    </div>

                    <div className="space-y-1 px-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Navigation</p>
                        <Link
                            href={`/tasks/${id}/manage?tab=applicants`}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[13px] transition-all shadow-sm ${tab === 'applicants' ? 'bg-blue-50 text-blue-600 shadow-blue-500/5' : 'text-slate-600 hover:bg-slate-50 shadow-transparent'}`}
                        >
                            <Users size={16} />
                            Applicants
                        </Link>
                        <Link
                            href={`/tasks/${id}/manage?tab=history`}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[13px] transition-all shadow-sm ${tab === 'history' ? 'bg-blue-50 text-blue-600 shadow-blue-500/5' : 'text-slate-600 hover:bg-slate-50 shadow-transparent'}`}
                        >
                            <History size={16} />
                            History
                        </Link>
                        <Link
                            href={`/tasks/${id}/manage?tab=settings`}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[13px] transition-all shadow-sm ${tab === 'settings' ? 'bg-blue-50 text-blue-600 shadow-blue-500/5' : 'text-slate-600 hover:bg-slate-50 shadow-transparent'}`}
                        >
                            <Settings size={16} />
                            Settings
                        </Link>
                    </div>

                    {task.status === 'DRAFT' && (
                        <div className="mt-auto px-4 pt-6">
                            <DevActivationButton taskId={id} />
                        </div>
                    )}
                </aside>

                {/* 2. Main content: Adjusted Feed Column */}
                <main className="flex-1 max-w-2xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-slate-50/50">
                    <div className="p-6">
                        <header className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                    Estado: {task.status}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px] uppercase tracking-tighter">
                                    <Settings size={14} />
                                    Gestión de Tarea
                                </div>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                {task.title}
                            </h1>
                        </header>

                        <section className="space-y-6">
                            {tab === 'applicants' && (
                                <>
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                        <h2 className="text-[16px] font-black flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            Aplicaciones Recibidas
                                        </h2>
                                        <span className="text-[12px] font-bold text-slate-400">
                                            {applications?.length || 0} postulantes
                                        </span>
                                    </div>

                                    <ApplicationList
                                        applications={applications || []}
                                        taskId={id}
                                        isDisabled={isAssigned}
                                        bountyAmount={task.bounty_amount}
                                        deadline={task.deadline}
                                    />
                                </>
                            )}

                            {tab === 'history' && (
                                <ActivityHistory activities={activities} />
                            )}

                            {tab === 'settings' && (
                                <SettingsView task={task} />
                            )}
                        </section>
                    </div>
                </main>

                {/* 3. Right Sidebar: Info Widgets Style */}
                <aside className="hidden lg:flex flex-col w-80 h-full border-l border-transparent px-4 overflow-y-auto py-6 no-scrollbar">
                    <div className="space-y-4">
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-200/50">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Detalles de Tarea</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-50 rounded-2xl">
                                        <DollarSign className="w-6 h-6 text-green-500 font-bold" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-black uppercase tracking-tight mb-0.5">Bounty en Escrow</span>
                                        <span className="text-2xl font-black text-slate-900">${task.bounty_amount}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Clock className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-black uppercase tracking-tight mb-0.5">Deadline Final</span>
                                        <span className="text-md font-black text-slate-900">{new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {isAssigned && (
                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <Link href={`/tasks/${id}/work`} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-[13px] rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                                        <Briefcase className="w-4 h-4" />
                                        Sala de trabajo
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4">
                            <div className="flex gap-4 text-xs font-bold text-slate-300">
                                <Link href="#" className="hover:text-blue-500 transition-colors">Terms</Link>
                                <Link href="#" className="hover:text-blue-500 transition-colors">Privacy</Link>
                                <Link href="#" className="hover:text-blue-500 transition-colors">Help</Link>
                            </div>
                            <p className="text-[11px] text-slate-200 font-bold mt-2">© 2024 TaskBounty</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
