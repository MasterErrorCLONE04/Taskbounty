import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
    ArrowLeft,
    ShieldCheck,
    Clock,
    DollarSign,
    FileText,
    ListChecks,
    MessageSquare,
    AlertCircle,
    Settings,
    Briefcase
} from 'lucide-react'

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
        <div className="min-h-screen bg-background pb-20">
            {/* Top Navigation */}
            <nav className="p-6 border-b border-border/40 bg-card">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/tasks/explore" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al explorador
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm">Escrow Protegido</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <header>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${task.status === 'OPEN' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                    'bg-primary/10 text-primary border border-primary/20'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight mb-4">
                                {task.title}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-sm font-medium">Publicado por</span>
                                    <span className="text-foreground font-bold">{client?.name || 'Cliente'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                    ★ {client?.rating || '0.0'}
                                </div>
                            </div>
                        </header>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <FileText className="w-5 h-5 text-primary" />
                                Descripción
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {task.description}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <ListChecks className="w-5 h-5 text-primary" />
                                Requisitos
                            </div>
                            <div className="bg-card border border-border rounded-3xl p-8">
                                <pre className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed">
                                    {task.requirements}
                                </pre>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="space-y-8">
                        <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-2xl shadow-primary/5 sticky top-8">
                            <div className="mb-8">
                                <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest block mb-2">Bounty Ofrecido</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black">${task.bounty_amount}</span>
                                    <span className="text-muted-foreground font-bold">USD</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                                        <Clock className="w-4 h-4" /> Tiempo restante
                                    </span>
                                    <span className="font-bold text-foreground">{diffDays} días</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                                        <MessageSquare className="w-4 h-4" /> Aplicaciones
                                    </span>
                                    <span className="font-bold text-foreground">{appCount} recibidas</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {isOwner ? (
                                    <Link
                                        href={`/tasks/${id}/manage`}
                                        className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Gestionar Tarea
                                    </Link>
                                ) : userRole === 'worker' || userRole === 'both' ? (
                                    task.status === 'OPEN' ? (
                                        <Link
                                            href={`/tasks/${id}/apply`}
                                            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Aplicar ahora
                                        </Link>
                                    ) : task.assigned_worker_id === user?.id ? (
                                        <Link
                                            href={`/tasks/${id}/work`}
                                            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            <Briefcase className="w-5 h-5" />
                                            Ir a sala de trabajo
                                        </Link>
                                    ) : (
                                        <button className="w-full bg-muted text-muted-foreground h-14 rounded-2xl font-bold cursor-not-allowed opacity-50">
                                            Ya no acepta aplicaciones
                                        </button>
                                    )
                                ) : !user ? (
                                    <Link
                                        href="/login"
                                        className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Ingresa para aplicar
                                    </Link>
                                ) : null}

                                <div className="flex items-start gap-2 p-3 bg-muted rounded-xl border border-border text-[10px] leading-tight text-muted-foreground">
                                    <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                    Al aplicar, aceptas nuestros términos de servicio y política de escrow.
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/50">
                                <div className="flex items-center gap-3 text-green-500 bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                                    <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                                    <div className="text-[11px] font-bold leading-normal">
                                        PAGO GARANTIZADO: Este bounty ya ha sido depositado en escrow por el cliente.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
