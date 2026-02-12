import Link from 'next/link';
import {
    ShieldCheck,
    Lock,
    ShieldAlert,
    CreditCard,
    Headphones,
    CheckCircle2,
    ChevronRight,
    ExternalLink,
    Zap,
    Fingerprint,
    Cpu
} from 'lucide-react';

export default function SecurityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                    <Link href="/#marketplace" className="hover:text-sky-500 transition-colors">Explorar Tareas</Link>
                    <Link href="/#como-funciona" className="hover:text-sky-500 transition-colors">Cómo funciona</Link>
                    <Link href="/security" className="text-sky-500 transition-colors">Seguridad</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/?login=true" className="text-sm font-bold text-slate-900 hover:text-sky-500 transition-colors px-4">
                        Iniciar sesión
                    </Link>
                    <Link
                        href="/?login=true"
                        className="bg-sky-500 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </nav>

            <main className="flex-grow pt-32">
                {/* HERO SECTION */}
                <section className="px-6 py-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            Tu seguridad es <span className="text-sky-500 italic">nuestra prioridad</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            En TaskBounty, hemos construido un ecosistema de confianza donde cada transacción, dato y comunicación está protegido por estándares de seguridad de grado bancario.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-sky-500" />
                                SSL Encriptado
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                                Socio de Stripe
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                                GDPR Ready
                            </div>
                        </div>
                    </div>
                </section>

                {/* PILLARS SECTION */}
                <section className="px-6 py-24 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <header className="text-center mb-20">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Pilares de Protección</h2>
                            <p className="text-slate-500 font-medium">Infraestructura diseñada para eliminar el riesgo en el trabajo remoto.</p>
                        </header>

                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            {[
                                {
                                    icon: <CreditCard className="w-6 h-6" />,
                                    title: "Sistema de Escrow Inteligente",
                                    desc: "Nuestra tecnología de retención técnica garantiza que los fondos estén asegurados antes de que comience el trabajo. El dinero se mantiene en una cuenta neutral y solo se libera cuando el cliente confirma la satisfacción del entregable.",
                                    link: "Más información →"
                                },
                                {
                                    icon: <Zap className="w-6 h-6" />,
                                    title: "Pagos Encriptados",
                                    desc: "Utilizamos la infraestructura de Stripe para procesar pagos con cumplimiento PCI Nivel 1. Tus datos financieros nunca tocan nuestros servidores; todo se maneja mediante tokens encriptados de alta seguridad.",
                                    badges: [<CreditCard key="stripe" className="w-4 h-4" />, <ShieldCheck key="pci" className="w-4 h-4" />]
                                },
                                {
                                    icon: <ShieldAlert className="w-6 h-6" />,
                                    title: "Resolución de Disputas",
                                    desc: "Contamos con un proceso de mediación imparcial. Si surge un desacuerdo, nuestro equipo de resolución revisa las pruebas y las comunicaciones internas para asegurar un veredicto justo basado en los términos acordados.",
                                    link: "Protocolo de mediación ↗"
                                },
                                {
                                    icon: <ShieldCheck className="w-6 h-6" />,
                                    title: "Protección de Datos",
                                    desc: "Cumplimos estrictamente con la normativa GDPR. Todos los datos sensibles están encriptados mediante AES-256 en reposo y TLS en tránsito, asegurando que tu privacidad sea inviolable.",
                                    compliance: "GDPR COMPLIANT"
                                }
                            ].map((pilar, i) => (
                                <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group outline outline-transparent hover:outline-sky-100">
                                    <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                        {pilar.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">{pilar.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-6">{pilar.desc}</p>

                                    {pilar.link && (
                                        <Link href="#" className="text-sky-500 text-xs font-black uppercase tracking-widest hover:gap-2 flex items-center transition-all">
                                            {pilar.link}
                                        </Link>
                                    )}

                                    {pilar.badges && (
                                        <div className="flex gap-4 opacity-30">
                                            {pilar.badges}
                                        </div>
                                    )}

                                    {pilar.compliance && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-[10px] font-black text-green-600 uppercase tracking-widest">
                                            {pilar.compliance}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ANTI-FRAUD SECTION */}
                <section className="px-6 py-24">
                    <div className="max-w-7xl mx-auto overflow-hidden rounded-[4rem] bg-slate-50 border border-slate-100 shadow-sm flex flex-col lg:row-reverse lg:flex-row">
                        {/* Left Content */}
                        <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center bg-white">
                            <div className="inline-flex px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-8 w-fit">
                                Protección Activa
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-12">
                                Nuestro Sistema Anti-Fraude de 3 Capas
                            </h2>

                            <div className="space-y-10">
                                {[
                                    {
                                        step: "1",
                                        title: "Detección por IA",
                                        desc: "Algoritmos que analizan patrones sospechosos en tiempo real para bloquear bots y estafadores antes de que actúen."
                                    },
                                    {
                                        step: "2",
                                        title: "Revisión Manual",
                                        desc: "Nuestro equipo de seguridad audita manualmente tareas de alto valor y reportes de usuarios las 24 horas del día."
                                    },
                                    {
                                        step: "3",
                                        title: "Verificación de Identidad",
                                        desc: "Procesos de KYC (Know Your Customer) obligatorios para retiros, asegurando que los fondos lleguen a personas reales."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center font-black text-sm">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="flex-1 bg-[#0f172a] p-12 lg:p-24 relative overflow-hidden flex items-center justify-center">
                            {/* Decorative grid */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                            <div className="relative z-10 w-full max-w-sm">
                                <div className="flex justify-between items-center mb-12">
                                    <Cpu className="w-16 h-16 text-sky-500/20" />
                                    <Fingerprint className="w-20 h-20 text-sky-500 animate-pulse" />
                                </div>

                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                                    <span className="text-4xl font-black text-white block mb-2">0% de Fraude</span>
                                    <span className="text-sky-500 font-black text-2xl block mb-4 italic">en 2023</span>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-relaxed">
                                        Nuestra tasa de efectividad en la protección de fondos de clientes es líder en la industria.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* LOGOS / SOCIAL PROOF */}
                <section className="px-6 py-24 border-b border-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.3em] mb-16">Seguridad verificada por líderes globales</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                            <div className="flex items-center gap-2 text-2xl font-black text-slate-900"><CreditCard className="w-6 h-6 text-sky-500" /> Stripe</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-900"><ShieldCheck className="w-7 h-7 text-sky-500" /> Norton</div>
                            <div className="flex items-center gap-2 text-2xl font-black text-slate-900"><Lock className="w-6 h-6 text-sky-500" /> Visa</div>
                            <div className="flex items-center gap-2 text-2xl font-black text-slate-900"><ShieldCheck className="w-6 h-6 text-sky-500" /> PCI-DSS</div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="px-6 py-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-sky-500 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                            {/* Decorative highlights */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-400/20 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3" />

                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 relative z-10">¿Tienes más preguntas?</h2>
                            <p className="text-sky-50 text-lg font-medium mb-12 max-w-2xl mx-auto relative z-10">
                                Nuestro equipo de soporte técnico está disponible 24/7 para resolver cualquier duda sobre nuestra política de seguridad.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                                <Link href="/help" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl text-lg font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                                    Visitar Help Center
                                </Link>
                                <Link href="#" className="w-full sm:w-auto px-10 py-5 bg-white text-sky-500 rounded-2xl text-lg font-black hover:bg-sky-50 transition-all shadow-xl active:scale-95">
                                    Contactar Soporte
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-white px-8 md:px-24 py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="p-1.5 bg-sky-500 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                            La plataforma de micro-tareas más segura del mundo, impulsada por tecnología escrow inteligente.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Legal</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/legal/privacy" className="hover:text-sky-500 transition-colors">Privacidad</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-sky-500 transition-colors">Términos</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-sky-500 transition-colors">Cookies</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Soporte</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/help" className="hover:text-sky-500 transition-colors">Centro de Ayuda</Link></li>
                            <li><Link href="/security" className="hover:text-sky-500 transition-colors">Seguridad</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Reportar Abuso</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Comunidad</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">LinkedIn</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <p>© 2024 TaskBounty Inc. Todos los derechos reservados.</p>
                    <div className="flex gap-8 items-center">
                        <div className="flex items-center gap-1.5 min-w-[120px]">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Estado del sistema: Operativo</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
