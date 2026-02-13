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
    Send,
    AlertTriangle,
    Download,
    File
} from 'lucide-react'
import ChatBox from '@/components/tasks/ChatBox'
import EvidenceForm from '@/components/tasks/EvidenceForm'
import ApprovalButton from '@/components/tasks/ApprovalButton'
import RatingForm from '@/components/tasks/RatingForm'
import DisputeForm from '@/components/tasks/DisputeForm'
import DisputeInfo from '@/components/tasks/DisputeInfo'
import FileUploader from '@/components/tasks/FileUploader'
import { getTaskFiles } from '@/actions/files'
import { getProfile, getPublicProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'


export default async function WorkRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/?login=true')

    const profile = await getProfile(user.id)

    // 2. Fetch task details
    const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (!task) notFound()

    // 3. Fetch participants
    const { data: client } = await supabase
        .from('users')
        .select('name, rating, role')
        .eq('id', task.client_id)
        .single()

    const { data: worker } = await supabase
        .from('users')
        .select('name, rating, role')
        .eq('id', task.assigned_worker_id)
        .single()

    // 4. Check access
    const isClient = user.id === task.client_id
    const isWorker = user.id === task.assigned_worker_id

    if (!isClient && !isWorker) {
        redirect('/unauthorized')
    }

    // 5. Fetch active dispute
    const { data: dispute } = await supabase
        .from('disputes')
        .select('*')
        .eq('task_id', id)
        .eq('status', 'open')
        .single()

    // 6. Fetch Files
    const files = await getTaskFiles(id)

    // 7. Determine Status & Badges
    const statusLabel = task.status.replace('_', ' ')
    const activeEscrow = ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'DISPUTED'].includes(task.status)

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">


                <main className="flex-1 max-w-7xl border-x border-slate-50 h-full overflow-y-auto no-scrollbar bg-slate-50/30">
                    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">

                        {/* Breadcrumb */}
                        <Link
                            href={isClient ? `/tasks/${id}/manage` : '/my-tasks'}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver a mis tareas
                        </Link>

                        {/* Task Header Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-purple-100">
                                        {statusLabel}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold tracking-wide">
                                        ID: {task.id.slice(0, 8)}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                                    {task.title}
                                </h1>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                    Bounty Retenido
                                </span>
                                <span className="text-4xl font-black text-blue-500 block leading-none">
                                    ${task.bounty_amount}
                                </span>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Column: Chat Room (8 cols) */}
                            <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider">
                                        <Send className="w-4 h-4 text-blue-500 -mt-0.5 transform -rotate-45" />
                                        Sala de Chat
                                    </h3>
                                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border border-green-100">
                                        En línea
                                    </span>
                                </div>
                                <div className="p-6 flex-1">
                                    <ChatBox taskId={id} currentUserId={user.id} />
                                </div>
                            </div>

                            {/* Right Column: Sidebar Widgets (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">

                                {/* Action Required Card */}
                                {task.status === 'SUBMITTED' && (
                                    <div className="bg-white rounded-[2rem] border-2 border-blue-500 p-6 shadow-lg shadow-blue-500/10 space-y-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-[100%] -mr-10 -mt-10 opacity-50 pointer-events-none" />

                                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                                            <AlertCircle className="w-5 h-5 fill-current text-white" />
                                            <h3 className="font-black text-sm uppercase tracking-wide text-blue-700">Acción Requerida</h3>
                                        </div>

                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {isClient
                                                ? 'El especialista ha enviado los entregables. Revísalos cuidadosamente antes de liberar el pago.'
                                                : 'Tu trabajo está en revisión. El cliente debe aprobarlo para liberar los fondos.'}
                                        </p>

                                        {isClient && (
                                            <div className="space-y-3 pt-2">
                                                <ApprovalButton taskId={id} />
                                                <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                                    <FileText className="w-4 h-4" /> Solicitar Revisión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Delivery Form for Worker */}
                                {isWorker && task.status === 'ASSIGNED' && (
                                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                                        <EvidenceForm taskId={id} />
                                    </div>
                                )}

                                {/* Dispute Button */}
                                {!['COMPLETED', 'CANCELLED'].includes(task.status) && (
                                    <button className="w-full py-4 rounded-[1.5rem] border-2 border-slate-900/5 bg-white text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-900/10 transition-all flex items-center justify-center gap-2 text-sm shadow-sm group">
                                        <AlertTriangle className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                                        Abrir Disputa
                                    </button>
                                )}

                                {/* Task Files Widget */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            Archivos de la tarea
                                        </h3>
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black">
                                            {files.length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {files.slice(0, 3).map((file: any) => ( // Show only first 3
                                            <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer border border-transparent hover:border-slate-200">
                                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-red-500 shadow-sm border border-slate-100">
                                                    <File className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-700 truncate">{file.file_name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                        {(file.file_size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                                <button className="text-slate-300 hover:text-blue-500 transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {files.length === 0 && (
                                            <p className="text-xs text-slate-400 italic text-center py-4">No hay archivos aún</p>
                                        )}

                                        <button className="w-full mt-2 py-2 text-xs font-bold text-blue-500 hover:text-blue-600 text-center">
                                            Ver todos los archivos
                                        </button>

                                        {/* File Uploader Trigger */}
                                        <div className="hidden">
                                            <FileUploader taskId={id} purpose="asset" label="Upload" />
                                        </div>
                                    </div>
                                </div>

                                {/* Participants Widget */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Participantes
                                    </h3>

                                    {/* Client */}
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">
                                            {(client?.name || '?').charAt(0)}
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Cliente</span>
                                            <span className="text-sm font-bold text-slate-900">{client?.name || 'Desconocido'}</span>
                                        </div>
                                    </div>

                                    {/* Worker */}
                                    {worker && (
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">
                                                {(worker?.name || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Especialista</span>
                                                <span className="text-sm font-bold text-slate-900">{worker?.name || 'Desconocido'}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 mt-2 border-t border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400 font-medium flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> Deadline:
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                {new Date(task.deadline).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400 font-medium flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" /> Escrow:
                                            </span>
                                            <span className="font-bold text-green-500 uppercase text-xs tracking-wide">
                                                {activeEscrow ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Requirements Widget */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                        Resumen de requisitos
                                    </h3>
                                    <p className="text-sm text-slate-800 font-medium italic mb-3 line-clamp-2">
                                        {task.title}
                                    </p>
                                    <Link href={`/tasks/${id}`} className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 group">
                                        Ver descripción completa
                                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
