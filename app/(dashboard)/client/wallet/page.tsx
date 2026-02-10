import React from 'react';
import { createClient } from '@/lib/supabase/server';
import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    Clock,
    Filter,
    Download,
    CreditCard,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { redirect } from 'next/navigation';
import TopUpButton from '@/components/wallet/TopUpButton';

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Fetch user balance
    const { data: balance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

    // Fetch transactions (payments where client_id is user.id)
    const { data: payments } = await supabase
        .from('payments')
        .select(`
            *,
            task:tasks(title)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="p-12 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-start mb-16">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight text-shadow-sm">Pagos y Wallet</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Gestiona tus fondos, depósitos y el historial de pagos de tus bounties.</p>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 group">
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    Exportar Reporte
                </button>
            </header>

            {/* Main Wallet Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Available Balance Card */}
                <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-12">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                <Wallet className="w-8 h-8 text-sky-400" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Status de Cuenta</p>
                                <span className="flex items-center gap-2 justify-end text-green-400 font-bold text-sm">
                                    <ShieldCheck className="w-4 h-4" /> Verificada
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Saldo Disponible</p>
                            <div className="flex items-end gap-4">
                                <h2 className="text-7xl font-black leading-none">${balance?.available_balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h2>
                                <span className="text-2xl font-bold text-slate-500 mb-2">USD</span>
                            </div>
                        </div>

                        <div className="mt-16 flex items-center gap-6">
                            <TopUpButton />
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-5 rounded-2xl transition-all backdrop-blur-md active:scale-95 uppercase tracking-widest text-xs border border-white/10">
                                Ver Detalles de Pago
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full blur-2xl -ml-32 -mb-32 pointer-events-none" />
                </div>

                {/* Secondary Stats Card */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-8">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Saldo en Retención (Escrow)</p>
                        <h3 className="text-4xl font-black text-slate-900">${balance?.pending_balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h3>
                        <p className="text-slate-400 text-xs mt-4 font-medium leading-relaxed">Este dinero está retenido de forma segura mientras tus freelancers completan las tareas activas.</p>
                    </div>

                    <div className="pt-8 border-t border-slate-50 mt-8">
                        <div className="flex items-center gap-3 text-sky-500 font-black text-xs uppercase tracking-widest group cursor-pointer">
                            Ver transacciones pendientes
                            <ArrowUpCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Historial de Transacciones</h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Lista completa de depósitos y pagos realizados.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transacción</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {!payments || payments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <TrendingUp className="w-12 h-12 text-slate-100 mb-4" />
                                            <p className="text-slate-400 font-bold">No se han encontrado movimientos financieros.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${payment.status === 'RELEASED' ? 'bg-red-50' : 'bg-green-50'}`}>
                                                    {payment.status === 'RELEASED' ? (
                                                        <ArrowUpCircle className="w-6 h-6 text-red-500" />
                                                    ) : (
                                                        <ArrowDownCircle className="w-6 h-6 text-green-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 mb-0.5">{payment.task?.title || 'Depósito TaskBounty'}</p>
                                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                                                        <CreditCard className="w-3 h-3" /> Stripe Checkout
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="font-bold text-slate-600 text-sm">{new Date(payment.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${payment.status === 'RELEASED' ? 'bg-green-50 text-green-500' :
                                                    payment.status === 'HELD' ? 'bg-amber-50 text-amber-500' :
                                                        payment.status === 'REFUNDED' ? 'bg-slate-100 text-slate-500' :
                                                            'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {payment.status === 'HELD' ? 'En Escrow' : payment.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <p className={`text-lg font-black ${payment.status === 'RELEASED' ? 'text-red-500' : 'text-slate-900'}`}>
                                                {payment.status === 'RELEASED' ? '-' : '+'}${payment.amount.toLocaleString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
