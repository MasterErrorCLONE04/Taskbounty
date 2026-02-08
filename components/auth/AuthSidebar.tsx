'use client';

import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export default function AuthSidebar() {
    return (
        <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden flex-col justify-center p-20">
            {/* Dot Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0ea5e9_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

            <div className="relative z-10 max-w-lg">
                <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-sky-500/20 mb-12 animate-in fade-in zoom-in duration-700">
                    <ShieldCheck className="w-8 h-8" />
                </div>

                <h1 className="text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                    El marketplace de tareas más <span className="text-sky-500 italic">seguro</span> del mundo.
                </h1>

                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-16 max-w-md">
                    Protegemos tus pagos con escrow inteligente para que solo te preocupes de hacer crecer tus proyectos.
                </p>

                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-sky-500" />
                            <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">Escrow Activo</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">Fondos siempre protegidos.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-sky-500" />
                            <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">Velocidad</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">Contratación inmediata.</p>
                    </div>
                </div>
            </div>

            {/* Floating Escrow Mockup */}
            <div className="absolute bottom-20 right-20 animate-in slide-in-from-bottom-20 duration-1000">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 w-72">
                    <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 bg-green-50 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">Protegido</span>
                        <span className="text-sky-500 font-black text-lg">$150.00</span>
                    </div>
                    <div className="space-y-3">
                        <div className="h-3 w-full bg-slate-50 rounded-full" />
                        <div className="h-3 w-4/5 bg-slate-50 rounded-full" />
                        <div className="flex items-center gap-3 pt-4">
                            <div className="w-8 h-8 rounded-full bg-sky-100" />
                            <div className="h-2 w-1/2 bg-slate-50 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
        </div>
    );
}
