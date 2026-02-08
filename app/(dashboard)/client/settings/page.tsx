import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileSettingsForm from '@/components/profile/ProfileSettingsForm';
import { Settings, Shield, Bell, Key } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Fetch profile data
    const { data: profile } = await supabase
        .from('users')
        .select('name, bio, skills, avatar_url')
        .eq('id', user.id)
        .single();

    return (
        <div className="p-12 max-w-4xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-start mb-16">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight text-shadow-sm">Configuración</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Administra tu perfil, seguridad y preferencias de cuenta.</p>
                </div>
                <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-slate-200">
                    <Settings className="w-8 h-8" />
                </div>
            </header>

            <div className="space-y-12">
                {/* Profile Section */}
                <section>
                    <ProfileSettingsForm initialData={profile || { name: user.email?.split('@')[0] || 'Usuario', bio: '', skills: [], avatar_url: null }} />
                </section>

                {/* Additional Settings Mocks */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:border-sky-100 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Seguridad de Cuenta</h4>
                            <p className="text-xs text-slate-400 font-medium">Contraseña y 2FA</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:border-amber-100 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Notificaciones</h4>
                            <p className="text-xs text-slate-400 font-medium">Email y Alertas Push</p>
                        </div>
                    </div>
                </section>

                {/* Account Danger Zone Mock */}
                <section className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="font-black text-rose-500 text-sm uppercase tracking-widest mb-1">Zona de Peligro</h4>
                        <p className="text-xs text-rose-400 font-medium">Desactiva o elimina tu cuenta de forma permanente</p>
                    </div>
                    <button className="bg-white border border-rose-100 text-rose-500 font-black px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        Desactivar Cuenta
                    </button>
                </section>
            </div>
        </div>
    );
}
