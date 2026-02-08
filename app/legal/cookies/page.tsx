'use client';

import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import {
    Cookie,
    CheckCircle,
    ExternalLink,
    ShieldCheck,
    Info
} from 'lucide-react';

export default function CookiesPage() {
    return (
        <LegalLayout title="Política de Cookies" lastUpdated="08 DE FEBRERO, 2026">
            <div className="space-y-20">
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <Cookie className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">1. ¿Qué son las cookies?</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Son pequeños archivos que se almacenan en tu navegador para recordar información sobre tu uso del sitio.
                        Permiten una navegación más fluida y personalizada.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">2. Tipos de cookies que usamos</h2>
                    </div>
                    <ul className="space-y-6">
                        {[
                            { title: "Cookies esenciales", desc: "Necesarias para el funcionamiento básico del sitio y la seguridad." },
                            { title: "Cookies de autenticación", desc: "Mantienen tu sesión activa para que no tengas que loguearte constantemente." },
                            { title: "Cookies analíticas", desc: "Nos ayudan a entender cómo se usa la plataforma para mejorar la experiencia." }
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4 items-start">
                                <div className="mt-1 w-5 h-5 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <ExternalLink className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">3. Cookies de terceros</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Podemos usar servicios de terceros (por ejemplo, Google Analytics o Stripe) que también utilizan cookies para procesos de seguridad y análisis anónimo.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">4. Control de cookies</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        Tienes el control total sobre las cookies en tu dispositivo:
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-3 text-slate-500 font-medium">
                            <span className="text-sky-500 font-black shrink-0">•</span>
                            Aceptar o rechazar cookies desde la configuración de tu navegador.
                        </li>
                        <li className="flex gap-3 text-slate-500 font-medium">
                            <span className="text-sky-500 font-black shrink-0">•</span>
                            Eliminar cookies existentes en cualquier momento.
                        </li>
                    </ul>
                </section>

                {/* Technical Note */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                        <Info className="w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-3 text-sky-400">Nota Técnica</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed m-0">
                            Desactivar algunas cookies esenciales puede afectar funcionalidades clave como el sistema de mensajes o el procesamiento de pagos seguros.
                        </p>
                    </div>
                </div>
            </div>
        </LegalLayout>
    );
}
