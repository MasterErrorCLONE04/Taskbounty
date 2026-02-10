'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface LegalLayoutProps {
    children: React.ReactNode;
    title: string;
    lastUpdated: string;
    sidebarLinks?: { name: string; href: string }[];
}

export default function LegalLayout({ children, title, lastUpdated, sidebarLinks }: LegalLayoutProps) {
    const pathname = usePathname();

    const defaultLinks = [
        { name: 'Privacidad', href: '/legal/privacy' },
        { name: 'Términos', href: '/legal/terms' },
        { name: 'Cookies', href: '/legal/cookies' },
    ];

    const links = sidebarLinks || defaultLinks;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                    <Link href="/tasks/explore" className="hover:text-sky-500 transition-colors">Explorar tareas</Link>
                    <Link href="/#como-funciona" className="hover:text-sky-500 transition-colors">Cómo funciona</Link>
                    <Link href="/#seguridad" className="hover:text-sky-500 transition-colors">Seguridad</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-sky-500 transition-colors px-4">
                        Iniciar sesión
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-sky-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25"
                    >
                        Publicar Tarea
                    </Link>
                </div>
            </nav>

            <main className="pt-20 min-h-screen flex flex-col">
                {/* Hero Section Legal */}
                <section className="bg-white border-b border-slate-100 pt-20 pb-16 px-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-12">
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                            {title}
                        </h1>
                        <p className="text-sm text-slate-400 font-medium">
                            Última actualización: {lastUpdated}
                        </p>
                    </div>
                </section>

                <section className="flex-1 py-12 px-6 md:py-20 lg:px-12 bg-slate-50">
                    <div className={`mx-auto ${sidebarLinks ? 'max-w-7xl grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-16' : 'max-w-4xl'} items-start`}>
                        {/* Sidebar Navigation */}
                        {sidebarLinks && (
                            <aside className="hidden lg:block sticky top-32">
                                <nav className="space-y-6">
                                    {sidebarLinks.map((link, i) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block text-[11px] font-black uppercase tracking-widest transition-all ${i === 0
                                                ? 'text-sky-500'
                                                : 'text-slate-400 hover:text-slate-900'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>
                            </aside>
                        )}

                        <div className="space-y-12">
                            {/* Content Sheet */}
                            <div className="bg-white rounded-[2.5rem] p-12 md:p-24 shadow-sm border border-slate-100">
                                <div className="prose prose-slate max-w-none 
                                    prose-h2:text-2xl prose-h2:font-black prose-h2:text-slate-900 prose-h2:tracking-tight prose-h2:mb-8 prose-h2:mt-16 first:prose-h2:mt-0
                                    prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium prose-p:text-base prose-p:mb-8
                                    prose-li:text-slate-500 prose-li:font-medium prose-li:text-base prose-li:mb-2
                                    prose-strong:text-slate-900 prose-strong:font-black">
                                    {children}
                                </div>
                            </div>

                            {/* Question Section */}
                            <div className="bg-sky-500 rounded-[2.5rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-sky-500/20">
                                <div className="max-w-lg">
                                    <h2 className="text-3xl font-black mb-3">¿Tienes dudas adicionales?</h2>
                                    <p className="text-sky-100 font-medium text-lg leading-relaxed">
                                        Nuestro equipo legal está disponible para resolver cualquier inquietud técnica.
                                    </p>
                                </div>
                                <Link
                                    href="mailto:soporte@taskbounty.io"
                                    className="bg-white text-sky-500 px-10 py-5 rounded-full font-black text-sm hover:bg-sky-50 transition-all shadow-xl whitespace-nowrap"
                                >
                                    Contactar Soporte
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Standard Footer */}
            <footer className="bg-white border-t border-slate-100 py-24 px-8 md:px-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="p-1.5 bg-sky-500 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 max-w-xs">
                            Reinventando el freelance mediante escrow inteligente y confianza digital absoluta.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors cursor-pointer border border-slate-100">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors cursor-pointer border border-slate-100">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Plataforma</h5>
                        <ul className="space-y-4 text-[13px] font-bold text-slate-400">
                            <li><Link href="/tasks/explore" className="hover:text-sky-500 transition-colors">Explorar Tareas</Link></li>
                            <li><Link href="/tasks/create" className="hover:text-sky-500 transition-colors">Publicar Tarea</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Freelancers</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Categorías</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Recursos</h5>
                        <ul className="space-y-4 text-[13px] font-bold text-slate-400">
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Como Funciona</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Centro de Ayuda</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Seguridad</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Legal</h5>
                        <ul className="space-y-4 text-[13px] font-bold text-slate-400">
                            <li><Link href="/legal/privacy" className="hover:text-sky-500 transition-colors">Privacidad</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-sky-500 transition-colors">Términos</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-sky-500 transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <p>© 2024 TASKBOUNTY INC. UN NUEVO ESTÁNDAR EN MARKETPLACE.</p>
                    <div className="flex gap-8">
                        <span className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                            <ExternalLink className="w-3 h-3" /> ESPAÑOL
                        </span>
                        <span className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                            USD ($)
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
