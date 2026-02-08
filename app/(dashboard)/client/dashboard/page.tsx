import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
    Plus,
    Wallet,
    Clock,
    CheckCircle2,
    ArrowRight,
    Edit3,
    MoreHorizontal
} from 'lucide-react';
import Image from 'next/image';

export default async function ClientDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch client tasks with worker info
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*, assigned_worker:users!assigned_worker_id(name, avatar_url)')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

    // Calculate stats
    const activeTasks = tasks?.filter(t => ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'DISPUTED'].includes(t.status)).length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'COMPLETED').length || 0;
    const totalSpent = tasks?.filter(t => t.status === 'COMPLETED').reduce((acc, t) => acc + Number(t.bounty_amount), 0) || 0;

    return (
        <div className="p-12 max-w-6xl mx-auto">
            {/* Header Area */}
            <header className="flex justify-between items-start mb-16">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Mi Panel de Cliente</h1>
                    <p className="text-slate-400 font-medium">Gestiona tus proyectos y libera pagos de forma segura.</p>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6 text-sky-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Total Gastado</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900">${totalSpent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Tareas Activas</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{activeTasks}</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Tareas Completadas</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{completedTasks}</p>
                </div>
            </div>

            {/* Tasks Section */}
            <section>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-slate-900">Mis tareas activas</h2>
                    <Link href="/client/tasks" className="text-sky-500 font-extrabold text-sm hover:underline">Ver todo</Link>
                </div>

                <div className="space-y-6">
                    {!tasks || tasks.length === 0 ? (
                        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center">
                            <p className="text-slate-400 font-bold mb-6 text-lg">No has publicado ninguna tarea todavía.</p>
                            <Link href="/tasks/create" className="text-sky-500 font-black hover:underline uppercase tracking-widest text-xs">
                                Empieza hoy mismo →
                            </Link>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className={`bg-white border rounded-[2.5rem] p-8 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-slate-200/50 ${task.status === 'DRAFT' ? 'border-dashed border-slate-200' : 'border-slate-100'}`}>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${task.status === 'OPEN' ? 'bg-green-50 text-green-500' :
                                                task.status === 'DRAFT' ? 'bg-slate-100 text-slate-500' :
                                                    task.status === 'DISPUTED' ? 'bg-rose-50 text-rose-500' :
                                                        task.status === 'COMPLETED' ? 'bg-sky-50 text-sky-500' :
                                                            'bg-slate-50 text-slate-500'
                                            }`}>
                                            {task.status}
                                        </span>
                                        <h3 className="text-xl font-black text-slate-900">{task.title}</h3>
                                    </div>
                                    <p className="text-slate-400 font-medium line-clamp-1 mb-4 max-w-xl">{task.description}</p>

                                    {/* Worker Info / Status */}
                                    <div className="flex items-center gap-3">
                                        {task.assigned_worker ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                    {task.assigned_worker.name[0]}
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{task.assigned_worker.name}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-sky-500'}`}>
                                                    {task.status === 'COMPLETED' ? '✓ Pagado' : '● Chat activo'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-300 italic text-xs font-medium">
                                                <div className="w-5 h-5 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center" />
                                                {task.status === 'DRAFT' ? `Borrador creado hace poco` : 'Esperando freelancer...'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-300 uppercase block mb-1 tracking-widest">Bounty</span>
                                        <span className="text-2xl font-black text-slate-900">${task.bounty_amount.toLocaleString()}</span>
                                    </div>
                                    <Link
                                        href={task.status === 'DRAFT' ? `/tasks/create?id=${task.id}` : `/tasks/${task.id}/manage`}
                                        className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all group/btn"
                                    >
                                        {task.status === 'DRAFT' ? (
                                            <Edit3 className="w-5 h-5 text-slate-400 group-hover/btn:text-white" />
                                        ) : (
                                            <ArrowRight className="w-6 h-6 text-slate-400 group-hover/btn:text-white group-hover/btn:ml-1 transition-all" />
                                        )}
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
