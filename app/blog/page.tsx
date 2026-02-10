'use client';

import Link from 'next/link';
import {
    ShieldCheck,
    Search,
    LayoutGrid,
    List,
    ChevronRight,
    ArrowRight,
    Mail,
    Zap,
    Clock,
    ExternalLink,
    Share2
} from 'lucide-react';

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                    <span className="ml-4 pl-4 border-l border-slate-200 text-sm font-bold text-slate-400 uppercase tracking-widest">Blog</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <Link href="/blog" className="text-sky-500 border-b-2 border-sky-500 pb-1">Todas</Link>
                    <Link href="#" className="hover:text-sky-500 transition-colors">Clientes</Link>
                    <Link href="#" className="hover:text-sky-500 transition-colors">Freelancers</Link>
                    <Link href="#" className="hover:text-sky-500 transition-colors">Actualizaciones</Link>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-slate-400 hover:text-sky-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link
                        href="/"
                        className="bg-sky-500 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                    >
                        Ir al Marketplace
                    </Link>
                </div>
            </nav>

            <main className="flex-grow pt-28">
                {/* FEATURED POST */}
                <section className="px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col lg:flex-row hover:shadow-xl transition-all group">
                            <div className="lg:w-3/5 relative h-[300px] lg:h-[500px] overflow-hidden">
                                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                                <img
                                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                                    alt="Featured blog post"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="lg:w-2/5 p-8 lg:p-16 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-sky-500 text-white text-[10px] font-black uppercase rounded-full">Destacado</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">• 8 min de lectura</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-6">
                                    Cómo escribir el bounty perfecto para atraer a los mejores expertos
                                </h1>
                                <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                                    Aprende las estrategias clave para definir tus tareas, establecer presupuestos justos y garantizar resultados de alta calidad desde el primer día.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900">Carlos Méndez</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Head of Product</p>
                                        </div>
                                    </div>
                                    <Link href="#" className="flex items-center gap-2 text-sky-500 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                        Leer más <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MAIN FEED & SIDEBAR */}
                <section className="px-6 py-20 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

                        {/* Posts Feed */}
                        <div className="lg:w-2/3">
                            <header className="flex items-center justify-between mb-12">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Últimas Publicaciones</h2>
                                <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                                    <button className="p-1.5 text-sky-500 bg-sky-50 rounded"><LayoutGrid className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600"><List className="w-4 h-4" /></button>
                                </div>
                            </header>

                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    {
                                        category: "Seguridad",
                                        img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
                                        date: "15 Mayo, 2024",
                                        read: "5 min read",
                                        title: "Protegiendo tus pagos: Cómo funciona el sistema Escrow",
                                        desc: "Descubre la tecnología detrás de nuestro sistema de protección de pagos y por qué es la forma más segura de contratar..."
                                    },
                                    {
                                        category: "Consejo",
                                        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop",
                                        date: "12 Mayo, 2024",
                                        read: "4 min read",
                                        title: "5 Micro-tareas que puedes delegar hoy mismo",
                                        desc: "Desde limpieza de datos hasta edición de video rápido. Maximiza tu productividad delegando lo operativo."
                                    },
                                    {
                                        category: "Actualizaciones",
                                        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
                                        date: "10 Mayo, 2024",
                                        read: "3 min read",
                                        title: "Nueva integración con billeteras Web3",
                                        desc: "Ahora puedes pagar tus bounties utilizando stablecoins. Más rápido, más global y con menores comisiones."
                                    },
                                    {
                                        category: "Freelancing",
                                        img: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2072&auto=format&fit=crop",
                                        date: "08 Mayo, 2024",
                                        read: "10 min read",
                                        title: "Guía para convertirte en un Top Hunter",
                                        desc: "Los secretos de los freelancers que ganan más de $2,000 al mes completando micro-tareas en TaskBounty."
                                    }
                                ].map((post, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
                                        <div className="relative h-56 overflow-hidden">
                                            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-slate-900/60 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-full border border-white/20">
                                                {post.category}
                                            </div>
                                            <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                <span>{post.date}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <span>{post.read}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-sky-500 transition-colors leading-tight">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                                                {post.desc}
                                            </p>
                                            <Link href="#" className="flex items-center gap-2 text-sky-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                                Continuar leyendo <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-16">
                                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                </button>
                                <button className="w-10 h-10 bg-sky-500 text-white rounded-xl font-black text-sm">1</button>
                                <button className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50">2</button>
                                <button className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50">3</button>
                                <span className="text-slate-400 mx-2">...</span>
                                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:w-1/3 space-y-12">
                            {/* Categories */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10">
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-4">Categorías</h4>
                                <ul className="space-y-4">
                                    {[
                                        { name: "Para Clientes", count: 12 },
                                        { name: "Para Freelancers", count: 24 },
                                        { name: "Actualizaciones", count: 8 },
                                        { name: "Seguridad", count: 6 },
                                        { name: "Casos de Éxito", count: 15 }
                                    ].map((cat, i) => (
                                        <li key={i} className="flex items-center justify-between group cursor-pointer">
                                            <span className="text-sm font-medium text-slate-500 group-hover:text-sky-500 transition-colors">{cat.name}</span>
                                            <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">{cat.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-sky-50 rounded-[2.5rem] border border-sky-100 p-10 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center mb-6">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-wider">Newsletter</h4>
                                    <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">
                                        Suscríbete para recibir los mejores bounties y consejos de productividad en tu email.
                                    </p>
                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                                        />
                                        <button className="w-full bg-sky-500 text-white font-black text-xs py-3 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                                            Suscribirse
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Most Read */}
                            <div>
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Más leídos</h4>
                                <div className="space-y-8">
                                    {[
                                        { id: "01", title: "Cómo evitar estafas en plataformas de trabajo remoto" },
                                        { id: "02", title: "La guía definitiva sobre impuestos para freelancers" },
                                        { id: "03", title: "Por qué el escrow es el futuro de la economía gig" }
                                    ].map((article, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                            <span className="text-2xl font-black text-sky-500 flex-shrink-0 leading-none">{article.id}</span>
                                            <h5 className="text-xs font-bold text-slate-800 leading-relaxed group-hover:text-sky-500 transition-colors">
                                                {article.title}
                                            </h5>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* BOTTOM CTA */}
                <section className="px-6 py-24 bg-[#0f172a] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
                            ¿Tienes un proyecto en mente?
                        </h2>
                        <p className="text-slate-400 text-lg font-medium mb-12 max-w-2xl mx-auto">
                            Publica tu primera tarea en minutos y deja que los expertos se encarguen del trabajo pesado.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/" className="w-full sm:w-auto px-10 py-5 bg-sky-500 text-white rounded-2xl text-lg font-black hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 active:scale-95">
                                Empezar ahora
                            </Link>
                            <Link href="#" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-lg font-black hover:bg-white/10 transition-all backdrop-blur-xl">
                                Ver demo
                            </Link>
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
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-8">
                            La plataforma de micro-servicios más segura del mundo gracias a nuestro sistema de escrow inteligente.
                        </p>
                        <div className="flex gap-4">
                            <Share2 className="w-4 h-4 text-slate-400 hover:text-sky-500 cursor-pointer" />
                            <ExternalLink className="w-4 h-4 text-slate-400 hover:text-sky-500 cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Producto</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/" className="hover:text-sky-500">Explorar Bounties</Link></li>
                            <li><Link href="/#como-funciona" className="hover:text-sky-500">Cómo funciona</Link></li>
                            <li><Link href="#" className="hover:text-sky-500">Precios</Link></li>
                            <li><Link href="/security" className="hover:text-sky-500">Seguridad</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Compañía</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="#" className="hover:text-sky-500">Sobre nosotros</Link></li>
                            <li><Link href="/blog" className="hover:text-sky-500">Blog</Link></li>
                            <li><Link href="#" className="hover:text-sky-500">Carreras</Link></li>
                            <li><Link href="/help" className="hover:text-sky-500">Contacto</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Legal</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/legal/privacy" className="hover:text-sky-500">Privacidad</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-sky-500">Términos</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-sky-500">Escrow Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <p>© 2024 TaskBounty Inc. Hecho con seguridad para el mundo digital.</p>
                    <div className="flex gap-8">
                        <span>Status</span>
                        <span>API</span>
                        <span>Soporte</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function User(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
