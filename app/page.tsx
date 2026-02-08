import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  ShieldAlert,
  Zap,
  Lock,
  Headphones,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Star
} from 'lucide-react';
import { getRecentOpenTasks } from '@/actions/tasks';

export default async function LandingPage() {
  const recentTasks = await getRecentOpenTasks();

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Diseño': return 'bg-green-500';
      case 'Código': return 'bg-sky-500';
      case 'Content': return 'bg-orange-500';
      case 'Video': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };
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
          <Link href="#marketplace" className="hover:text-sky-500 transition-colors">Explorar Tareas</Link>
          <Link href="#como-funciona" className="hover:text-sky-500 transition-colors">Cómo funciona</Link>
          <Link href="#seguridad" className="hover:text-sky-500 transition-colors">Seguridad</Link>
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
        {/* HERO SECTION */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-[10px] font-black uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                🚀 Siempre listos para ayudarte
              </div>
              <h1 className="text-6xl lg:text-[84px] font-black leading-[0.95] tracking-tighter text-slate-900 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Publica tu tarea. <br />
                <span className="text-sky-500">Paga con seguridad.</span> <br />
                Resultados garantizados.
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-lg mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                La plataforma de micro-tareas que protege tu dinero. Solo liberamos el pago cuando confirmas que el trabajo está perfecto.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <Link
                  href="/tasks/create"
                  className="w-full sm:w-auto px-10 py-5 bg-sky-500 text-white rounded-full text-lg font-black hover:bg-sky-600 transition-all shadow-2xl shadow-sky-500/40 active:scale-95"
                >
                  Comenzar Ahora
                </Link>
                <Link
                  href="/tasks/explore"
                  className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 rounded-full text-lg font-black hover:bg-slate-50 transition-all text-slate-900"
                >
                  Explorar Bounties
                </Link>
              </div>
            </div>

            {/* Floating Cards (Decorative Image representation from mockup) */}
            <div className="relative hidden lg:block h-[600px] animate-in fade-in zoom-in duration-1000 delay-500">
              {/* Card 1: Logo design */}
              <div className="absolute top-10 left-10 p-6 bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-72 rotate-[-5deg] hover:rotate-0 transition-transform duration-500 z-30 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase">Identidad</span>
                  <span className="font-black text-sky-500 text-xl">$50.00</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-sky-500 transition-colors">Diseño de Logotipo</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">Crear identidad visual para startup fintech...</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200" />
                  <div className="h-2 w-20 bg-slate-100 rounded-full" />
                </div>
              </div>

              {/* Card 2: Python Script */}
              <div className="absolute top-0 right-0 p-6 bg-white rounded-[2rem] shadow-2xl border border-sky-200 w-80 rotate-[3deg] hover:rotate-0 transition-transform duration-500 z-40">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-sky-500/10 text-sky-500 text-[10px] font-black rounded-full uppercase">Python</span>
                  <span className="font-black text-sky-500 text-xl">$120.00</span>
                </div>
                <h3 className="font-bold text-lg mb-4">Script Automatización</h3>
                <div className="space-y-3 mb-6">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-sky-500" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>Progreso</span>
                    <span>65%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="text-xs font-bold">En ejecución</span>
                </div>
              </div>

              {/* Card 3: SEO Audit */}
              <div className="absolute bottom-20 left-20 p-6 bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-72 rotate-[2deg] hover:rotate-0 transition-transform duration-500 z-20">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase">SEO Audit</span>
                  <span className="font-black text-sky-500 text-xl">$75.00</span>
                </div>
                <div className="h-32 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-slate-200" />
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-sky-500 flex items-center justify-center text-[8px] font-bold text-white">+5</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE BOUNTIES GRID */}
        <section id="marketplace" className="px-6 py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Explora Bounties Activos</h2>
                <p className="text-slate-500 font-medium">Tareas verificadas listas para ser resueltas ahora mismo.</p>
              </div>
              <Link href="/tasks/explore" className="text-sky-500 font-black flex items-center gap-2 hover:gap-3 transition-all group">
                Ver todo el marketplace
                <ChevronRight className="w-5 h-5" />
              </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentTasks.length > 0 ? (
                recentTasks.map((task, i) => (
                  <div key={task.id} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden">
                    <div className="relative h-56 bg-slate-100 rounded-[2rem] mb-6 overflow-hidden">
                      <div className={`absolute top-4 left-4 z-10 px-2.5 py-1 ${getCategoryColor(task.category)} text-white text-[9px] font-black uppercase rounded-full`}>
                        {task.category || 'General'}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <Search className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <span className="text-2xl font-black text-slate-900 leading-none mb-1 block">${task.bounty_amount.toLocaleString()}</span>
                      <h3 className="font-bold text-slate-800 mb-6 group-hover:text-sky-500 transition-colors line-clamp-1">{task.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <Clock className="w-3 h-3" />
                          Activo
                        </div>
                        <Link href={`/tasks/${task.id}`} className="text-[10px] font-black text-sky-500 uppercase tracking-widest border-b-2 border-sky-500 pb-0.5">
                          Ver Bounty
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay bounties activos en este momento</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RISK-FREE TRANSACTIONS (Steps) */}
        <section id="como-funciona" className="px-6 py-24 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">Transacciones Sin Riesgo</h2>
            <p className="text-slate-500 font-medium mb-20">Eliminamos la incertidumbre en los pagos digitales con nuestro proceso de 3 pasos.</p>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Decorative line */}
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-slate-100 -z-10" />

              {[
                { title: "Publica y Escrow", desc: "Describe la tarea y deposita los fondos. El dinero queda bloqueado de forma segura en TaskBounty." },
                { title: "Ejecución Garantizada", desc: "El freelancer comienza a trabajar sabiendo que el pago está asegurado. Recibes entregas constantes." },
                { title: "Aprobación y Pago", desc: "Revisa el resultado. Si estás satisfecho, libera el pago con un click. El sistema es así de simple." }
              ].map((step, i) => (
                <div key={i} className="space-y-6">
                  <div className="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto shadow-xl shadow-sky-500/20">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section id="seguridad" className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#0f172a] rounded-[4rem] p-8 lg:p-24 overflow-hidden relative group">
              {/* Decorative background flare */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full group-hover:bg-sky-500/20 transition-all duration-1000" />

              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-12">
                  <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tighter">Diseñado para la confianza absoluta.</h2>

                  <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      { icon: <ShieldCheck className="w-5 h-5" />, title: "Fondos Protegidos", desc: "Tu inversión no se libera hasta que el trabajo esté terminado y aprobado." },
                      { icon: <Zap className="w-5 h-5" />, title: "Velocidad Total", desc: "Contrata y resuelve en minutos en un marketplace sin fricciones." },
                      { icon: <Headphones className="w-5 h-5" />, title: "Soporte 24/7", desc: "Mediación humana en caso de disputas para asegurar un trato justo." },
                      { icon: <Lock className="w-5 h-5" />, title: "Retiros Instantáneos", desc: "Los freelancers cobran al instante tras la verficación del cliente." }
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500">
                          {item.icon}
                        </div>
                        <h4 className="font-black text-white">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1e293b]/50 border border-white/5 rounded-[3rem] p-12 text-center relative">
                  <div className="w-20 h-20 bg-sky-500/10 rounded-[2rem] flex items-center justify-center text-sky-500 mx-auto mb-8 animate-pulse">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Sistema Anti-Fraude</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-8">Nuestra infraestructura utiliza los estándares más altos de seguridad financiera para proteger cada centavo.</p>
                  <div className="flex items-center justify-center gap-3 text-white/40 text-[10px] uppercase font-black tracking-widest">
                    <CreditCard className="w-4 h-4 text-sky-500" />
                    PCI-DSS COMPLIANCE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS / SOCIAL PROOF */}
        <section className="px-6 py-12 border-b border-slate-50">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.3em] mb-12">Seguridad respaldada por</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 text-2xl font-black text-slate-900"><CreditCard className="w-6 h-6 text-sky-500" /> Stripe</div>
              <div className="flex items-center gap-2 text-2xl font-black text-slate-900"><ShieldCheck className="w-6 h-6 text-sky-500" /> Norton</div>
              <div className="flex items-center gap-2 text-2xl font-black text-slate-900"><Lock className="w-6 h-6 text-sky-500" /> Visa Secure</div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 py-24 bg-sky-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8">¿Listo para delegar tu primera tarea?</h2>
            <p className="text-sky-50 text-xl font-medium mb-12">Únete a la comunidad de emprendedores que construyen con seguridad.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tasks/create" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-full text-lg font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Publicar mi primera Tarea
              </Link>
              <Link href="/tasks/explore" className="w-full sm:w-auto px-10 py-5 bg-white text-sky-500 rounded-full text-lg font-black hover:bg-sky-50 transition-all shadow-xl active:scale-95">
                Explorar Oportunidades
              </Link>
            </div>
            <p className="text-sky-100 text-[10px] font-black uppercase tracking-[0.2em] mt-12">MAS DE 12,000 BOUNTIES MENSUALES · SOLO PAGAS LO QUE AMAS</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white px-8 md:px-24 py-20">
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
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors cursor-pointer">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Plataforma</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><Link href="/tasks/explore" className="hover:text-sky-500 transition-colors">Explorar Tareas</Link></li>
              <li><Link href="/tasks/create" className="hover:text-sky-500 transition-colors">Publicar Tarea</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Freelancers</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Categorías</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Recursos</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Cómo Funciona</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Seguridad</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Legal</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><Link href="/legal/privacy" className="hover:text-sky-500 transition-colors">Privacidad</Link></li>
              <li><Link href="/legal/terms" className="hover:text-sky-500 transition-colors">Términos</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-sky-500 transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <p>© 2024 TaskBounty Inc. Un nuevo estándar en marketplaces.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1">Espanol</span>
            <span className="cursor-pointer hover:text-slate-900 transition-colors flex items-center gap-1">USD ($)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
