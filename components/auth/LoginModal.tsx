'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AppLogo } from '@/components/navigation/AppLogo';

interface LoginModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSwitchToSignupAction: () => void;
}

export function LoginModal({ isOpen, onCloseAction, onSwitchToSignupAction }: LoginModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) throw loginError;

            const { data: { user } } = await supabase.auth.getUser();
            // Optional: Redirect based on role or just close modal/refresh
            // const role = user?.user_metadata?.role || 'both';

            router.refresh();
            onCloseAction();

        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Iniciar Sesión">
            <div className="px-12 pb-12 pt-4">
                <header className="mb-8 text-center flex flex-col items-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Sign in to TaskBounty</h2>
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-500 text-xs rounded-2xl font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 mb-6">
                    <div className="space-y-1">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full h-14 px-4 rounded-lg border border-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium text-slate-900 placeholder:text-slate-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full h-14 px-4 rounded-lg border border-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium text-slate-900 placeholder:text-slate-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50 text-[15px] mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log in'}
                    </button>

                    <button type="button" className="w-full h-10 border border-slate-200 text-slate-900 font-bold rounded-full hover:bg-slate-50 transition-all flex items-center justify-center text-[15px]">
                        Forgot password?
                    </button>
                </form>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-xs font-medium text-slate-500">or</span>
                    <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="space-y-3 mb-6">
                    <button className="w-full h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group font-bold text-sm text-slate-700">
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                        Sign in with Google
                    </button>
                    <button className="w-full h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group font-bold text-sm text-slate-700">
                        <img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg" className="w-5 h-5" alt="LinkedIn" />
                        Sign in with LinkedIn
                    </button>
                </div>

                <p className="mt-8 text-center text-[15px] text-slate-500">
                    Don't have an account? <span onClick={onSwitchToSignupAction} className="text-sky-500 hover:underline cursor-pointer font-medium">Sign up</span>
                </p>
            </div>
        </Modal>
    );
}
