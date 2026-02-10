import Link from 'next/link';
import {
    ShieldCheck,
    Search,
    Star,
    ChevronRight,
    ChevronLeft,
    Filter,
    CheckCircle2,
    SlidersHorizontal,
    Briefcase,
    ExternalLink,
    ChevronDown,
    BadgeCheck
} from 'lucide-react';
import { getFreelancers } from '@/actions/profile';

export default async function FreelancersPage() {
    const freelancers = await getFreelancers();
    const topFreelancers = freelancers.slice(0, 4);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/30 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">TaskBounty</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                    <Link href="/#marketplace" className="hover:text-sky-500 transition-colors">Explorar tareas</Link>
                    <Link href="/#como-funciona" className="hover:text-sky-500 transition-colors">Cómo funciona</Link>
                    <Link href="/security" className="hover:text-sky-500 transition-colors">Seguridad</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-sky-500 transition-colors px-4">
                        Iniciar sesión
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-sky-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                    >
                        Publicar Tarea
                    </Link>
                </div>
            </nav>

            <main className="flex-grow pt-24">
                {/* TOP FREELANCERS CAROUSEL */}
                <section className="px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        <header className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Freelancers Top</h2>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-sky-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-sky-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topFreelancers.length > 0 ? topFreelancers.map((pro: any, i: number) => (
                                <div key={pro.id} className="bg-white rounded-[2rem] border border-slate-100 p-8 text-center hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className="absolute top-4 right-4 text-sky-500">
                                        <CheckCircle2 className="w-5 h-5 fill-sky-500 text-white" />
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto mb-6 relative group-hover:scale-105 transition-transform overflow-hidden">
                                        <img
                                            src={pro.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pro.name}`}
                                            alt={pro.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1 truncate px-2 flex items-center justify-center gap-1">
                                        {pro.name}
                                        {pro.is_verified && (
                                            <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500/10" />
                                        )}
                                    </h3>
                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-4 truncate">
                                        {pro.skills && pro.skills.length > 0 ? pro.skills[0] : 'Expert'}
                                    </p>
                                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-8">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-slate-900">{pro.rating || '0.0'}</span>
                                    </div>
                                    <Link href={`/profiles/${pro.id}`} className="block w-full py-3 bg-sky-50 text-sky-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all text-center">
                                        Ver Perfil
                                    </Link>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-[2rem]">
                                    No hay freelancers destacados en este momento
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* EXPLORE SECTION */}
                <section className="px-6 py-20 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Filters */}
                        <aside className="lg:w-1/4 space-y-8">
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Filtros</h4>

                                <div className="space-y-10">
                                    {/* Skills */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Habilidades</p>
                                        <div className="space-y-4">
                                            {["Diseño UI/UX", "Desarrollo Web", "Copywriting", "Marketing Digital", "Data Science"].map((skill, i) => (
                                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-sky-500 focus:ring-sky-500/20" />
                                                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">{skill}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Rango de Precios (USD)</p>
                                        </div>
                                        <input type="range" className="w-full accent-sky-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                                        <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400">
                                            <span>$10</span>
                                            <span>$500+</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Calificación</p>
                                        <div className="space-y-4">
                                            {[
                                                { label: "4.5+ ", star: true },
                                                { label: "4.0+ ", star: true }
                                            ].map((r, i) => (
                                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="radio" name="rating" className="w-4 h-4 border-slate-200 text-sky-500 focus:ring-sky-500/20" />
                                                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900 flex items-center gap-1">
                                                        {r.label} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Disponibilidad</p>
                                        <div className="relative">
                                            <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 outline-none appearance-none">
                                                <option>Inmediata</option>
                                                <option>Próxima semana</option>
                                                <option>Bajo consulta</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Join CTA */}
                            <div className="bg-sky-50 shadow-lg shadow-sky-500/10 rounded-[2rem] p-8 border border-sky-100 text-center">
                                <h4 className="font-black text-slate-900 mb-2">¿Eres Freelancer?</h4>
                                <p className="text-[11px] text-slate-500 font-medium mb-6 leading-relaxed">Únete a la red y empieza a ganar completando bounties.</p>
                                <Link href="/register" className="block w-full py-3 bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 text-center">
                                    Registrarme
                                </Link>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:w-3/4">
                            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                <p className="text-xs font-medium text-slate-400">
                                    Mostrando <span className="font-black text-slate-900">{freelancers.length}</span> freelancers disponibles
                                </p>
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Ordenar por:</span>
                                    <button className="flex items-center gap-1 text-sky-500 font-black">
                                        Relevancia <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </header>

                            <div className="grid md:grid-cols-2 gap-8">
                                {freelancers.length > 0 ? freelancers.map((pro: any, i: number) => (
                                    <div key={pro.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all group">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0 relative overflow-hidden">
                                                    <img
                                                        src={pro.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pro.name}`}
                                                        alt={pro.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="max-w-[150px]">
                                                    <div className="flex items-center gap-1.5">
                                                        <h3 className="font-black text-slate-900 truncate">{pro.name}</h3>
                                                        {pro.is_verified && (
                                                            <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500/10" />
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest truncate">
                                                        {pro.skills && pro.skills.length > 0 ? pro.skills[0] : 'Expert'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-2.5 py-1 ${pro.role === 'worker' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-sky-500 bg-sky-50 border-sky-100'} rounded-lg text-[9px] font-black uppercase border`}>
                                                {pro.role === 'worker' ? 'PROFESIONAL' : 'HÍBRIDO'}
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                                            {pro.bio || "Este profesional aún no ha definido su biografía, pero está disponible para nuevos retos."}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Calidad</p>
                                                <p className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {pro.rating || '0.0'}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                <p className="text-[10px] font-black text-emerald-500 uppercase">DISPONIBLE</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-10 min-h-[30px]">
                                            {pro.skills && pro.skills.length > 0 ? pro.skills.slice(0, 3).map((tag: string, j: number) => (
                                                <span key={j} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">
                                                    {tag}
                                                </span>
                                            )) : (
                                                <span className="px-3 py-1 bg-slate-50 text-slate-300 text-[10px] font-black uppercase rounded-lg border border-slate-100 select-none opacity-50">
                                                    Generalist
                                                </span>
                                            )}
                                        </div>

                                        <Link href={`/profiles/${pro.id}`} className="block w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-center">
                                            Ver Perfil
                                        </Link>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white border border-slate-100 rounded-[2.5rem]">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Filter className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron freelancers</h3>
                                        <p className="text-sm text-slate-500">Intenta ajustar los filtros para obtener más resultados.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-16">
                                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-sky-500 hover:border-sky-500 transition-all">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 bg-sky-500 text-white rounded-xl font-black text-xs">1</button>
                                {freelancers.length > 8 && (
                                    <button className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl font-black text-xs hover:border-sky-500 hover:text-sky-500 transition-all">2</button>
                                )}
                                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-sky-500 hover:border-sky-500 transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
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
                            Reinventando el freelance mediante escrow inteligente y confianza digital absoluta.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-500 cursor-pointer transition-colors shadow-sm">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-500 cursor-pointer transition-colors shadow-sm">
                                <Search className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Plataforma</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/tasks/explore" className="hover:text-sky-500">Explorar Tareas</Link></li>
                            <li><Link href="/tasks/create" className="hover:text-sky-500">Publicar Tarea</Link></li>
                            <li><Link href="/freelancers" className="text-sky-500 font-bold">Freelancers</Link></li>
                            <li><Link href="#" className="hover:text-sky-500">Categorías</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Recursos</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/#como-funciona" className="hover:text-sky-500">Cómo Funciona</Link></li>
                            <li><Link href="/help" className="hover:text-sky-500">Centro de Ayuda</Link></li>
                            <li><Link href="/security" className="hover:text-sky-500">Seguridad</Link></li>
                            <li><Link href="/blog" className="hover:text-sky-500">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Legal</h5>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left">
                            <li><Link href="/legal/privacy" className="hover:text-sky-500">Privacidad</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-sky-500">Términos</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-sky-500">Política de Escrow</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <p>© 2024 TaskBounty Inc. Un nuevo estándar en marketplaces.</p>
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                            <span className="w-2 h-2 rounded-full bg-slate-200" /> Español
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                            USD ($)
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
