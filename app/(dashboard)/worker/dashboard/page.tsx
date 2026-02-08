import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Search, Wallet, Clock, CheckCircle2, ArrowUpRight, TrendingUp, AlertCircle } from 'lucide-react';
import LogOutButton from '@/components/dashboard/LogOutButton';
import PayoutButtons from '@/components/dashboard/PayoutButtons';
import ProfileSettingsForm from '@/components/profile/ProfileSettingsForm';

export default async function WorkerDashboard({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const stripeSuccess = params.stripe_success === 'true';
    const stripeError = params.stripe_error === 'true';
    const activeTab = (params.tab as string) || 'jobs';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch balances
    const { data: balance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user?.id)
        .single();

    // Fetch user profile for Stripe Connect ID and Bio
    const { data: profile } = await supabase
        .from('users')
        .select('name, bio, skills, avatar_url, stripe_connect_id')
        .eq('id', user?.id)
        .single();

    // Fetch active applications/jobs
    const { data: applications } = await supabase
        .from('applications')
        .select('*, tasks(*)')
        .eq('worker_id', user?.id);

    const activeJobsCount = applications?.filter(a => a.status === 'accepted' && a.tasks.status !== 'COMPLETED').length || 0;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Mi Panel de Trabajador</h1>
                    <p className="text-muted-foreground text-lg">Busca nuevas oportunidades y gestiona tus ganancias.</p>
                </div>
                <div className="flex items-center gap-4">
                    <LogOutButton />
                    <Link
                        href="/tasks/explore"
                        className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group"
                    >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Explorar tareas
                    </Link>
                </div>
            </header>

            {stripeSuccess && (
                <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    Cuenta de Stripe vinculada correctamente. ¡Ya puedes retirar fondos!
                </div>
            )}

            {stripeError && (
                <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5" />
                    Hubo un problema al vincular tu cuenta de Stripe. Por favor, inténtalo de nuevo.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-card p-8 rounded-3xl border-2 border-primary/20 shadow-xl shadow-primary/5 bg-gradient-to-br from-card to-primary/5 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-muted-foreground mb-4 font-bold uppercase tracking-widest text-xs">
                            <TrendingUp className="w-4 h-4 text-primary" /> Balance Disponible
                        </div>
                        <p className="text-5xl font-black text-primary mb-6">${balance?.available_balance?.toLocaleString() || '0.00'}</p>

                        <PayoutButtons
                            stripeId={profile?.stripe_connect_id}
                            availableBalance={Number(balance?.available_balance || 0)}
                        />
                    </div>
                    <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 text-primary shadow-2xl opacity-5 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground mb-4 font-bold uppercase tracking-widest text-xs">
                        <Wallet className="w-4 h-4" /> Balance Pendiente
                    </div>
                    <p className="text-4xl font-black">${balance?.pending_balance?.toLocaleString() || '0.00'}</p>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground mb-4 font-bold uppercase tracking-widest text-xs">
                        <Clock className="w-4 h-4" /> Trabajos en curso
                    </div>
                    <p className="text-4xl font-black">{activeJobsCount}</p>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-100 mb-8">
                <Link
                    href="/worker/dashboard?tab=jobs"
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 
                        ${activeTab === 'jobs' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600'}
                    `}
                >
                    Mis Trabajos
                </Link>
                <Link
                    href="/worker/dashboard?tab=profile"
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 
                        ${activeTab === 'profile' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600'}
                    `}
                >
                    Mi Perfil Profesional
                </Link>
            </div>

            {activeTab === 'jobs' ? (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold mb-6">Mis trabajos activos</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {!applications || applications.length === 0 ? (
                            <div className="bg-card rounded-3xl border-2 border-dashed border-border p-12 text-center">
                                <p className="text-muted-foreground font-medium mb-4 text-lg">Aún no has aplicado a ninguna tarea.</p>
                                <Link href="/tasks/explore" className="text-primary font-bold hover:underline">
                                    Explorar el marketplace →
                                </Link>
                            </div>
                        ) : (
                            applications.filter(a => a.status === 'accepted').map((app) => (
                                <div key={app.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg transition-shadow">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${app.tasks.status === 'DISPUTED'
                                                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                                                : 'bg-primary/10 text-primary'
                                                }`}>
                                                {app.tasks.status}
                                            </span>
                                            <h3 className="text-lg font-bold">{app.tasks.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{app.tasks.description}</p>
                                    </div>
                                    <div className="flex items-center gap-8 text-right min-w-fit">
                                        <div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Bounty</span>
                                            <span className="text-xl font-black text-primary">${app.tasks.bounty_amount}</span>
                                        </div>
                                        <Link
                                            href={`/tasks/${app.tasks.id}/work`}
                                            className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                                        >
                                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            ) : (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                    <ProfileSettingsForm
                        initialData={{
                            name: profile?.name || '',
                            bio: profile?.bio || '',
                            skills: profile?.skills || [],
                            avatar_url: profile?.avatar_url || ''
                        }}
                    />
                    <div className="mt-8 flex justify-end">
                        <Link
                            href={`/profiles/${user?.id}`}
                            target="_blank"
                            className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-2 hover:underline"
                        >
                            Ver mi perfil público <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
