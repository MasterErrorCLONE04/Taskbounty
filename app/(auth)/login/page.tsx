'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import AuthSidebar from '@/components/auth/AuthSidebar';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const msg = searchParams.get('message');
        if (msg) setMessage(msg);
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) throw loginError;

            const { data: { user } } = await supabase.auth.getUser();
            const role = user?.user_metadata?.role || 'both';

            if (role === 'client') {
                router.push('/client/dashboard');
            } else {
                router.push('/worker/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <AuthSidebar />

            <main className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-20 relative">
                <div className="max-w-md w-full">
                    <header className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Bienvenido de nuevo</h2>
                        <p className="text-slate-400 font-medium">Gestiona tus tareas y pagos con seguridad.</p>
                    </header>

                    {message && (
                        <div className="mb-8 p-5 bg-sky-50 border border-sky-100 text-sky-500 text-sm rounded-[2rem] font-bold">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-500 text-sm rounded-[2rem] font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1" htmlFor="email">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                required
                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-700"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest" htmlFor="password">
                                    Contraseña
                                </label>
                                <Link href="#" className="text-[10px] font-black text-sky-500 hover:underline uppercase tracking-widest">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-700"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-sky-500 text-white font-black rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center disabled:opacity-50 text-sm uppercase tracking-widest"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Iniciar sesión'}
                        </button>
                    </form>

                    <div className="mt-12">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="w-full h-px bg-slate-100" />
                            <span className="absolute bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">o continúa con</span>
                        </div>

                        <button className="w-full h-16 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 hover:bg-slate-50 transition-all group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-black text-slate-700 tracking-tight">Continuar con Google</span>
                        </button>
                    </div>

                    <p className="mt-12 text-center text-xs font-bold text-slate-400 tracking-tight">
                        ¿No tienes una cuenta? <Link href="/signup" className="text-sky-500 hover:underline">Regístrate</Link>
                    </p>
                </div>

                <footer className="absolute bottom-10 left-0 w-full flex justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                    <Link href="/legal/terms" className="hover:text-slate-500 transition-colors">Términos</Link>
                    <Link href="/legal/privacy" className="hover:text-slate-500 transition-colors">Privacidad</Link>
                    <Link href="/legal/cookies" className="hover:text-slate-500 transition-colors">Cookies</Link>
                </footer>
            </main>
        </div>
    );
}
