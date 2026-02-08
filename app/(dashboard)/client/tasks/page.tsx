import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
    Plus,
    Search,
    ChevronDown,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Clock,
    User,
    ArrowRight,
    FileText
} from 'lucide-react';
import { redirect } from 'next/navigation';

import MyTasksFilters from '@/components/dashboard/MyTasksFilters';

export default async function MyTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const resolvedParams = await searchParams;
    const search = resolvedParams.search || '';
    const tab = resolvedParams.tab || 'active';
    const status = resolvedParams.status || 'all';

    // Fetch tasks with applications count and worker info
    let query = supabase
        .from('tasks')
        .select(`
            *,
            assigned_worker:users!assigned_worker_id(name, avatar_url),
            applications:applications(count)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    if (tab === 'active') {
        query = query.in('status', ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'DISPUTED']);
    } else if (tab === 'history') {
        query = query.in('status', ['COMPLETED', 'CANCELLED']);
    }

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data: tasks, error } = await query;

    if (error) {
        console.error('Error fetching my tasks:', error);
    }

    // Counts for tabs
    const { data: allTasks } = await supabase.from('tasks').select('status').eq('client_id', user.id);
    const activeCount = allTasks?.filter(t => ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'DISPUTED'].includes(t.status)).length || 0;

    return (
        <div className="p-12 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Mis Tareas</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Administra tus requerimientos y el progreso de los freelancers.</p>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/tasks/create"
                        className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Publicar nueva tarea
                    </Link>
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-12 border-b border-slate-100 mb-8">
                <Link
                    href="/client/tasks?tab=active"
                    className={`px-2 py-4 border-b-4 font-black text-sm uppercase tracking-widest transition-all ${tab === 'active' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    Activas ({activeCount})
                </Link>
                <Link
                    href="/client/tasks?tab=history"
                    className={`px-2 py-4 border-b-4 font-black text-sm uppercase tracking-widest transition-all ${tab === 'history' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    Historial
                </Link>
            </div>

            {/* Filter Bar (Client Component) */}
            <MyTasksFilters
                initialSearch={search as string}
                initialStatus={status as string}
                tab={tab as string}
            />

            {/* Task Content List */}
            <div className="space-y-8">
                {(!tasks || tasks.length === 0) ? (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center">
                        <p className="text-slate-400 font-bold mb-6 text-lg tracking-tight">No tienes tareas en esta categoría.</p>
                        <Link href="/tasks/create" className="text-sky-500 font-black hover:underline uppercase tracking-widest text-xs">
                            Crear mi primera tarea →
                        </Link>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <ClientTaskCard key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
}

function ClientTaskCard({ task }: { task: any }) {
    const statusInfo = {
        'OPEN': { label: 'OPEN', color: 'bg-green-50 text-green-500', icon: Clock },
        'IN_PROGRESS': { label: 'IN PROGRESS', color: 'bg-sky-50 text-sky-500', icon: Clock },
        'DISPUTED': { label: 'DISPUTED', color: 'bg-rose-50 text-rose-500', icon: AlertCircle },
        'COMPLETED': { label: 'COMPLETED', color: 'bg-sky-50 text-sky-500', icon: CheckCircle2 },
        'DRAFT': { label: 'DRAFT', color: 'bg-slate-100 text-slate-500', icon: FileText }
    }[task.status as string] || { label: task.status, color: 'bg-slate-50 text-slate-500', icon: Clock };

    const StatusIcon = statusInfo.icon;

    return (
        <div className={`bg-white border rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between relative overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/50 ${task.status === 'DRAFT' ? 'border-dashed border-slate-200' : 'border-slate-100 shadow-sm border-l-4'
            } ${task.status === 'DISPUTED' ? 'border-l-rose-500' :
                task.status === 'IN_PROGRESS' ? 'border-l-sky-500' :
                    (task.status === 'OPEN' ? 'border-l-green-500' : 'border-l-transparent')
            }`}>
            <div className="flex-grow pr-8">
                <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                        {task.status === 'DISPUTED' ? (
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                        ) : (
                            <Clock className="w-3 h-3" />
                        )}
                        {task.status === 'DISPUTED' ? 'Conflicto reportado hace poco' : `Creado hace ${new Date(task.created_at).toLocaleDateString()}`}
                    </div>
                </div>

                <h3 className={`text-2xl font-black text-slate-900 mb-4 tracking-tight ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                </h3>
                <p className="text-slate-400 font-medium mb-8 leading-relaxed line-clamp-2 max-w-2xl">
                    {task.description}
                </p>

                {/* Sub-info based on status */}
                <div className="flex items-center gap-6">
                    {task.status === 'OPEN' && (
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                                        <User className="w-3 h-3" />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full bg-sky-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-sky-500">
                                    +{task.applications?.[0]?.count || 0}
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 tracking-tight italic">
                                {task.applications?.[0]?.count || 0} aplicantes interesados
                            </span>
                        </div>
                    )}

                    {task.status === 'IN_PROGRESS' && task.assigned_worker && (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 border-2 border-white shadow-sm font-sans">
                                {task.assigned_worker.name[0]}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Freelancer asignado</p>
                                <p className="text-sm font-black text-slate-700">{task.assigned_worker.name}</p>
                            </div>
                            <div className="ml-4 px-3 py-1 bg-sky-50 rounded-lg text-[9px] font-black text-sky-500 uppercase tracking-widest border border-sky-100/50">
                                Entrega en 18h
                            </div>
                        </div>
                    )}

                    {task.status === 'DISPUTED' && (
                        <div className="flex items-center gap-3 p-3 px-5 bg-rose-50/50 rounded-2xl border border-rose-100/30">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-rose-500 font-black">
                                {task.assigned_worker?.name[0] || '?'}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Disputa con:</p>
                                <p className="text-sm font-black text-slate-700">{task.assigned_worker?.name || 'Cargando...'}</p>
                            </div>
                        </div>
                    )}

                    {task.status === 'COMPLETED' && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-400">
                                Freelancer <span className="text-slate-600">{task.assigned_worker?.name}</span>
                            </p>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Pago Liberado</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end justify-between min-w-[200px]">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                        {task.status === 'OPEN' ? 'Bounty Estimado' :
                            task.status === 'DISPUTED' ? 'En Retención' :
                                task.status === 'COMPLETED' ? 'Total Pagado' : 'Bounty Total'}
                    </p>
                    <p className={`text-4xl font-black ${task.status === 'DISPUTED' ? 'text-rose-500' : 'text-slate-900'}`}>
                        ${task.bounty_amount.toLocaleString()}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {task.status === 'IN_PROGRESS' && (
                        <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-sky-500 hover:border-sky-100 transition-all shadow-sm">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                    )}

                    {task.status === 'DISPUTED' && (
                        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-rose-100 text-rose-500 shadow-lg shadow-rose-100/50 group hover:bg-rose-500 hover:text-white transition-all">
                            <AlertCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    <Link
                        href={task.status === 'OPEN' ? `/tasks/${task.id}/manage` : `/tasks/${task.id}/manage`}
                        className={`px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${task.status === 'OPEN' ? 'bg-white border border-sky-100 text-sky-500 hover:bg-sky-50' :
                            task.status === 'DISPUTED' ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' :
                                task.status === 'COMPLETED' ? 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600' :
                                    'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {task.status === 'OPEN' ? 'Revisar Aplicantes' :
                            task.status === 'DISPUTED' ? 'Abrir Disputa' :
                                task.status === 'COMPLETED' ? 'Ver Recibo' : 'Ver Detalles'}
                        {task.status !== 'COMPLETED' && task.status !== 'DISPUTED' && <ArrowRight className="w-4 h-4" />}
                    </Link>
                </div>
            </div>
        </div>
    );
}
