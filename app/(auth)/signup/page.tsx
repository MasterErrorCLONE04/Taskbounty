'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import AuthSidebar from '@/components/auth/AuthSidebar';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'both' // Default role
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role: formData.role,
                    },
                },
            });

            if (signupError) throw signupError;

            router.push('/login?message=Cuenta creada con éxito. Ya puedes iniciar sesión.');
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <AuthSidebar />

            <main className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-20 relative overflow-y-auto">
                <div className="max-w-md w-full py-12">
                    <header className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Crea tu cuenta</h2>
                        <p className="text-slate-400 font-medium">Únete a TaskBounty y empieza a ganar o delegar tareas.</p>
                    </header>

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-500 text-sm rounded-[2rem] font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1" htmlFor="name">
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                name="name"
                                placeholder="Juan Pérez"
                                required
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-700"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-700"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-700"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">
                                ¿Qué rol prefieres?
                            </label>
                            <select
                                name="role"
                                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-500 text-xs uppercase tracking-widest"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="both">Ambos (Cliente y Trabajador)</option>
                                <option value="client">Cliente (Quiero delegar tareas)</option>
                                <option value="worker">Trabajador (Quiero realizar tareas)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-sky-500 text-white font-black rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center disabled:opacity-50 text-sm uppercase tracking-widest pt-1"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Registrarse'}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-xs font-bold text-slate-400 tracking-tight">
                        ¿Ya tienes cuenta? <Link href="/login" className="text-sky-500 hover:underline">Inicia sesión</Link>
                    </p>
                </div>

                <footer className="mt-auto py-10 flex gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    <Link href="/legal/terms" className="hover:text-slate-500 transition-colors">Términos</Link>
                    <Link href="/legal/privacy" className="hover:text-slate-500 transition-colors">Privacidad</Link>
                    <Link href="/legal/cookies" className="hover:text-slate-500 transition-colors">Ayuda</Link>
                </footer>
            </main>
        </div>
    );
}
