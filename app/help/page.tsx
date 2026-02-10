'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    ShieldCheck,
    Search,
    Zap,
    CreditCard,
    ShieldAlert,
    Briefcase,
    User,
    ChevronDown,
    Headphones,
    ArrowLeft
} from 'lucide-react';

export default function HelpCenterPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "¿Cómo funciona el sistema de Escrow?",
            answer: "El sistema de Escrow retiene los fondos del cliente en una cuenta segura hasta que el trabajo es entregado y aprobado. Solo entonces se liberan los fondos al freelancer."
        },
        {
            question: "¿Qué pasa si no estoy satisfecho con el trabajo?",
            answer: "Si el trabajo no cumple con lo acordado, puedes solicitar una revisión. Si no se llega a un acuerdo, nuestro equipo de mediación intervendrá para resolver la disputa."
        },
        {
            question: "¿Cuánto tarda en acreditarse un retiro?",
            answer: "Los retiros suelen procesarse en un plazo de 24 a 48 horas hábiles, dependiendo del método de pago seleccionado y las verificaciones de seguridad."
        },
        {
            question: "¿Existen comisiones por usar la plataforma?",
            answer: "Sí, aplicamos una comisión transparente por cada transacción para mantener la plataforma y el sistema de protección. Los detalles varían según el tipo de tarea."
        },
        {
            question: "¿Es seguro compartir mi información?",
            answer: "Absolutamente. Utilizamos encriptación AES-256 y cumplimos con GDPR para asegurar que tus datos personales y financieros estén protegidos en todo momento."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                    <span className="ml-4 pl-4 border-l border-slate-200 text-sm font-bold text-slate-400">Centro de Ayuda</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xs font-bold text-slate-500 hover:text-sky-500 transition-colors hidden md:block">
                        Volver al Marketplace
                    </Link>
                    <Link
                        href="/login"
                        className="bg-sky-500 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </nav>

            <main className="flex-grow pt-20">
                {/* HERO SEARCH SECTION */}
                <section className="bg-white px-6 py-20 md:py-32 border-b border-slate-100">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8">
                            ¿Cómo podemos ayudarte?
                        </h1>

                        <div className="relative mb-6">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Busca artículos, guías o solución de problemas..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400">
                            <span className="font-bold uppercase tracking-widest text-[10px]">Sugerencias:</span>
                            <button className="text-sky-500 hover:underline">Escrow</button>
                            <button className="text-sky-500 hover:underline">Retiros</button>
                            <button className="text-sky-500 hover:underline">Disputas</button>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES GRID */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.3em] mb-12">Explorar por categorías</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {[
                                { icon: <Zap className="w-5 h-5" />, title: "Primeros pasos", desc: "Configura tu cuenta y lanza tu primer bounty." },
                                { icon: <CreditCard className="w-5 h-5" />, title: "Pagos y Escrow", desc: "Cómo funciona el sistema de seguridad en los pagos." },
                                { icon: <ShieldAlert className="w-5 h-5" />, title: "Seguridad y Disputas", desc: "Protección de datos y resolución de conflictos." },
                                { icon: <Briefcase className="w-5 h-5" />, title: "Perfil de Freelancer", desc: "Gestiona tus habilidades, portafolio y cobros." },
                                { icon: <User className="w-5 h-5" />, title: "Perfil de Cliente", desc: "Publicación de tareas y gestión de contratos." }
                            ].map((cat, i) => (
                                <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer text-center">
                                    <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        {cat.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-3 group-hover:text-sky-500 transition-colors uppercase text-xs tracking-wide">{cat.title}</h3>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{cat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="px-6 py-20 bg-slate-100/50">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-black text-slate-900 mb-12">Preguntas Frecuentes</h2>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-bold text-slate-800">{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`px-8 transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 py-6 border-t border-slate-50' : 'max-h-0 overflow-hidden'}`}>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <button className="text-sky-500 font-bold text-sm hover:underline">
                                Ver todas las preguntas frecuentes
                            </button>
                        </div>
                    </div>
                </section>

                {/* SUPPORT CTA */}
                <section className="px-6 py-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-sky-500 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-sky-500/20">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <h2 className="text-4xl font-black text-white mb-6 relative z-10">¿No encontraste lo que buscabas?</h2>
                            <p className="text-sky-50 text-lg font-medium mb-12 max-w-lg mx-auto relative z-10 leading-relaxed">
                                Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier duda o problema.
                            </p>

                            <button className="bg-white text-sky-500 px-10 py-5 rounded-3xl text-lg font-black hover:bg-sky-50 transition-all shadow-xl active:scale-95 inline-flex items-center gap-3 relative z-10">
                                <Headphones className="w-6 h-6" />
                                Contacta con soporte
                            </button>

                            <p className="text-sky-100 text-[10px] font-black uppercase tracking-[0.2em] mt-8 relative z-10">
                                Tiempo de respuesta habitual: menos de 2 horas
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-white px-8 md:px-24 py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-sky-500 rounded-md">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-slate-900">TaskBounty</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Link href="/legal/terms" className="hover:text-slate-900 transition-colors">Términos</Link>
                        <Link href="/legal/privacy" className="hover:text-slate-900 transition-colors">Privacidad</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Estatus del sistema</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Contacto</Link>
                    </div>

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        © 2024 TaskBounty Inc.
                    </p>
                </div>
            </footer>
        </div>
    );
}
