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
    Briefcase
} from 'lucide-react'
import ApplicationList from '@/components/tasks/ApplicationList'
import DevActivationButton from '@/components/tasks/DevActivationButton'

export default async function ManageTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Fetch task details
    const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (!task) notFound()

    // 2. Fetch applications for this task
    // In a real app, join with users table to get names and ratings
    const { data: applications } = await supabase
        .from('applications')
        .select('*, worker:users(name, rating)')
        .eq('task_id', id)
        .order('created_at', { ascending: false })

    const isAssigned = task.status !== 'OPEN' && task.status !== 'DRAFT'

    return (
        <div className="min-h-screen bg-background pb-20">
            <nav className="p-6 border-b border-border/40 bg-card mb-12">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/client/dashboard" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al panel
                    </Link>
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm">Gestión de Tarea</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content: Applications */}
                    <div className="lg:col-span-2 space-y-8">
                        <header className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                                Estado: {task.status}
                            </div>
                            <h1 className="text-4xl font-black tracking-tight mb-4">
                                {task.title}
                            </h1>
                        </header>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Users className="w-6 h-6 text-primary" />
                                    Aplicaciones Recibidas
                                </h2>
                                <span className="px-4 py-1.5 bg-muted rounded-full text-sm font-bold">
                                    {applications?.length || 0} postulantes
                                </span>
                            </div>

                            <ApplicationList
                                applications={applications || []}
                                taskId={id}
                                isDisabled={isAssigned}
                            />
                        </section>
                    </div>

                    {/* Sidebar: Task Info */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border rounded-3xl p-8 sticky top-8 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Detalles Económicos</h3>
                                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border">
                                    <div className="p-2 bg-green-500/10 rounded-xl">
                                        <DollarSign className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block font-bold">Bounty en Escrow</span>
                                        <span className="text-2xl font-black">${task.bounty_amount}</span>
                                    </div>
                                </div>
                            </div>

                            {task.status === 'DRAFT' && (
                                <div className="pt-4">
                                    <DevActivationButton taskId={id} />
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Detalles de Tiempo</h3>
                                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Clock className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block font-bold">Deadline Final</span>
                                        <span className="text-lg font-black">{new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {isAssigned && (
                                <div className="pt-8 border-t border-border">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Trabajador Asignado</h3>
                                    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                                        <Briefcase className="w-6 h-6 text-primary" />
                                        <Link href={`/tasks/${id}/work`} className="text-primary font-bold hover:underline">
                                            Ir a sala de trabajo →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
