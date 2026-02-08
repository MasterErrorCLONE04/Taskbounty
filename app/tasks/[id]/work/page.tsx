import React from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
    ArrowLeft,
    ShieldCheck,
    Briefcase,
    AlertCircle,
    FileText,
    Clock,
    ExternalLink,
    CheckCircle2,
    Send
} from 'lucide-react'
import ChatBox from '@/components/tasks/ChatBox'
import EvidenceForm from '@/components/tasks/EvidenceForm'
import ApprovalButton from '@/components/tasks/ApprovalButton'
import RatingForm from '@/components/tasks/RatingForm'
import DisputeForm from '@/components/tasks/DisputeForm'
import DisputeInfo from '@/components/tasks/DisputeInfo'
import FileUploader from '@/components/tasks/FileUploader'
import FileGallery from '@/components/tasks/FileGallery'
import { getTaskFiles } from '@/actions/files'
import { User as UserIcon } from 'lucide-react'
import { getPublicProfile } from '@/actions/profile'

export default async function WorkRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch task details (no joins)
    const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (!task) notFound()

    // 2.1 Fetch participants separately for robustness
    const { data: client } = await supabase
        .from('users')
        .select('name, rating')
        .eq('id', task.client_id)
        .single()

    const { data: worker } = await supabase
        .from('users')
        .select('name, rating')
        .eq('id', task.assigned_worker_id)
        .single()

    // 3. Check access
    const isClient = user.id === task.client_id
    const isWorker = user.id === task.assigned_worker_id

    if (!isClient && !isWorker) {
        redirect('/unauthorized')
    }

    // 4. Check for existing reviews by the current user for this task
    const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('task_id', id)
        .eq('reviewer_id', user.id)
        .single()

    // 5. Fetch active dispute if status is DISPUTED
    const { data: dispute } = await supabase
        .from('disputes')
        .select('*')
        .eq('task_id', id)
        .eq('status', 'open')
        .single()

    // 6. Fetch Files
    const files = await getTaskFiles(id)

    // 7. Fetch Participants Info for links
    const clientProfile = await getPublicProfile(task.client_id)
    const workerProfile = task.assigned_worker_id ? await getPublicProfile(task.assigned_worker_id) : null

    const deadlineDate = new Date(task.deadline)
    const isOverdue = deadlineDate < new Date() && task.status !== 'COMPLETED'

    return (
        <div className="min-h-screen bg-background pb-20">
            <nav className="p-6 border-b border-border/40 bg-card mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href={isClient ? `/tasks/${id}/manage` : '/worker/dashboard'}
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver
                    </Link>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm">Sala de Trabajo Activa</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Task Info & Chat (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <header className="bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {task.status}
                                    </span>
                                    <p className="text-xs text-muted-foreground font-bold">ID: {task.id.slice(0, 8)}</p>
                                </div>
                                <h1 className="text-3xl font-black tracking-tight">{task.title}</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Bounty Retenido</span>
                                    <span className="text-2xl font-black text-primary">${task.bounty_amount}</span>
                                </div>
                            </div>
                        </header>

                        <ChatBox taskId={id} currentUserId={user.id} />
                    </div>

                    {/* Right Column: Evidence & Users (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Delivery Section */}
                        {isWorker && task.status === 'ASSIGNED' && (
                            <EvidenceForm taskId={id} />
                        )}

                        {task.status === 'SUBMITTED' && (
                            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 space-y-4">
                                <div className="flex items-center gap-3 text-primary font-bold">
                                    <ShieldCheck className="w-6 h-6" />
                                    Trabajo en revisión
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {isClient
                                        ? 'El trabajador ha enviado los resultados. Revisa los detalles arriba y aprueba para liberar los fondos.'
                                        : 'Has enviado tu entrega. Espera a que el cliente la revise y apruebe.'}
                                </p>
                                {isClient && (
                                    <ApprovalButton taskId={id} />
                                )}
                            </div>
                        )}

                        {task.status === 'COMPLETED' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-2">
                                    <ShieldCheck className="w-12 h-12 text-green-500 mx-auto" />
                                    <h3 className="text-xl font-bold">Tarea Finalizada</h3>
                                    <p className="text-sm text-muted-foreground">Los fondos han sido liberados correctamente.</p>
                                </div>

                                {!existingReview ? (
                                    <RatingForm
                                        taskId={id}
                                        targetUserId={isClient ? task.assigned_worker_id : task.client_id}
                                        targetName={isClient ? worker?.name : client?.name}
                                    />
                                ) : (
                                    <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-3xl text-center">
                                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                                        <p className="font-bold">Ya has calificado esta tarea. ¡Gracias!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {task.status === 'DISPUTED' && dispute && (
                            <DisputeInfo dispute={dispute} />
                        )}

                        {/* Dispute trigger for active tasks (not completed or disputed) */}
                        {['ASSIGNED', 'SUBMITTED'].includes(task.status) && (
                            <DisputeForm taskId={id} />
                        )}

                        {/* Files Section */}
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Archivos de la Tarea</h3>
                                <div className="px-2 py-0.5 bg-sky-500/10 text-sky-500 rounded-lg text-[10px] font-black uppercase">
                                    {files.length}
                                </div>
                            </div>

                            <FileGallery
                                files={files}
                                canDelete={true} // In a real app, we'd check if auth.uid() === file.uploader_id
                            />

                            {/* Show uploader only if task is active */}
                            {['ASSIGNED', 'SUBMITTED', 'IN_PROGRESS'].includes(task.status) && (
                                <div className="pt-4 border-t border-border/50">
                                    <FileUploader
                                        taskId={id}
                                        purpose="deliverable"
                                        label="Subir entregable o recurso"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Participants Card */}
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Participantes</h3>
                            <div className="space-y-4">
                                {/* Client Info */}
                                {clientProfile && (
                                    <Link
                                        href={`/profiles/${clientProfile.id}`}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm font-black text-sky-500 shadow-sm">
                                            {clientProfile.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</p>
                                            <p className="font-bold text-slate-900 group-hover:text-sky-500 transition-colors">{clientProfile.name}</p>
                                        </div>
                                    </Link>
                                )}

                                {/* Worker Info */}
                                {workerProfile ? (
                                    <Link
                                        href={`/profiles/${workerProfile.id}`}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm font-black text-sky-500 shadow-sm">
                                            {workerProfile.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialista</p>
                                            <p className="font-bold text-slate-900 group-hover:text-sky-500 transition-colors">{workerProfile.name}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-center">
                                        <p className="text-xs font-bold text-slate-400 italic">Buscando especialista...</p>
                                    </div>
                                )}
                            </div>
                            <div className="pt-6 border-t border-border space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Deadline:
                                    </span>
                                    <span className={`font-bold ${isOverdue ? 'text-destructive' : ''}`}>
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Escrow:
                                    </span>
                                    <span className="text-green-500 font-bold">ACTIVO</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Overlay */}
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-4">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Resumen de requisitos</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 italic">
                                {task.requirements}
                            </p>
                            <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                                Ver descripción completa <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    )
}
