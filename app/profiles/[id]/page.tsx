import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    Award,
    Briefcase,
    Calendar,
    MapPin,
    Star,
    TrendingUp,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    BadgeCheck
} from 'lucide-react'
import { getPublicProfile } from '@/actions/profile'

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const profile = await getPublicProfile(id)

    if (!profile) notFound()

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Navigation */}
            <nav className="p-6 bg-white border-b border-slate-100 mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/tasks/explore"
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-500 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Marketplace
                    </Link>
                    {profile.is_verified && (
                        <div className="flex items-center gap-2 text-sky-500">
                            <BadgeCheck className="w-5 h-5 fill-sky-500/10" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {profile.verified_until ? `Verificado hasta ${new Date(profile.verified_until).toLocaleDateString()}` : 'Profesional Verificado'}
                            </span>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Info Card (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-sky-500" />

                            <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-black text-slate-300 uppercase">
                                        {profile.name.slice(0, 2)}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-black text-slate-900 mb-1">{profile.name}</h1>
                            <div className="flex items-center justify-center gap-1 text-sky-500 font-bold mb-4">
                                <Star className="w-4 h-4 fill-sky-500" />
                                {profile.rating || 'N/A'}
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed italic mb-8 px-4">
                                "{profile.bio || 'Este usuario aún no ha definido su biografía profesional.'}"
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {(profile.skills || []).map((skill: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-tight border border-sky-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-50">
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Miembro desde {new Date(profile.created_at).getFullYear()}
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase">
                                    <Award className="w-3.5 h-3.5" />
                                    Especialista Verificado
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-sky-900/10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-6">Métricas de Éxito</h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-3xl font-black block">${profile.stats.totalEarned}.00</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ingresos Totales</span>
                                </div>
                                <div>
                                    <span className="text-3xl font-black block">{profile.stats.taskCount}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Bounties Ganados</span>
                                </div>
                                <div className="pt-4">
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-sky-500 h-full w-[100%]" />
                                    </div>
                                    <span className="text-[10px] font-bold text-sky-500 uppercase mt-2 block tracking-widest">Job Success: 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Portfolio & History (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-sky-500 text-white rounded-[1.5rem] shadow-lg shadow-sky-500/20">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Historial de Bounties</h2>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Proyectos completados con éxito</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {profile.stats.portfolio.length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                        <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="font-bold text-slate-400">Este trabajador está listo para su primer bounty.</p>
                                    </div>
                                ) : (
                                    profile.stats.portfolio.map((task: any) => (
                                        <div key={task.id} className="group relative bg-slate-50 rounded-[2rem] p-6 hover:bg-white hover:ring-2 hover:ring-sky-500/10 transition-all border border-transparent hover:shadow-xl hover:shadow-sky-500/5">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-white rounded-2xl text-green-500 shadow-sm">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 mb-1 group-hover:text-sky-600 transition-colors uppercase tracking-tight">
                                                            {task.title}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-lg">{task.category || 'General'}</span>
                                                            <span>{new Date(task.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase block mb-0.5 tracking-widest">Recompensa</span>
                                                    <span className="text-xl font-black text-green-600">${task.bounty_amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Badges / Experience Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Disponibilidad</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Activo y disponible para nuevos Bounties</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Ubicación</h3>
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-5 h-5 text-sky-500" />
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Global / Remoto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
