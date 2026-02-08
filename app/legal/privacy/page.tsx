'use client';

import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import {
    Database,
    Settings,
    ShieldCheck,
    Cookie,
    Users,
    Lock,
    Mail
} from 'lucide-react';

export default function PrivacyPage() {
    return (
        <LegalLayout title="Política de Privacidad" lastUpdated="24 DE MAYO, 2026">
            <div className="space-y-20">
                {/* Section 1 */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <Database className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">Recopilación de Datos</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                        Recopilamos información necesaria para proporcionar un entorno seguro y eficiente en nuestro marketplace. Esto incluye:
                    </p>
                    <ul className="space-y-4">
                        {[
                            { label: "Información de cuenta", desc: "Nombre, correo electrónico y foto de perfil cuando te registras." },
                            { label: "Detalles de la tarea", desc: "Información que incluyes en tus publicaciones de 'bounties' o propuestas." },
                            { label: "Datos de navegación", desc: "Dirección IP, tipo de dispositivo y comportamiento de uso para mejorar la plataforma." },
                            { label: "Identificación", desc: "Para procesos de cumplimiento (KYC), podemos solicitar documentos de identidad adicionales." }
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-slate-500 font-medium">
                                <span className="text-sky-500 font-black shrink-0">•</span>
                                <div>
                                    <span className="text-slate-900 font-black block sm:inline mr-2">{item.label}:</span>
                                    {item.desc}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Section 2 */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">Uso de la Información</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                        La información que recopilamos se utiliza exclusivamente para los siguientes fines:
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Facilitar la conexión entre clientes y freelancers.",
                            <>Gestionar el sistema de <span className="text-slate-900 font-black">Escrow Inteligente</span> para garantizar pagos seguros.</>,
                            "Enviar notificaciones críticas sobre el estado de las tareas y transacciones.",
                            "Prevenir actividades fraudulentas y mantener la integridad del marketplace.",
                            "Mejorar continuamente nuestra interfaz de usuario y experiencia de navegación."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-slate-500 font-medium">
                                <span className="text-sky-500 font-black shrink-0">•</span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Stripe Safety Callout */}
                <section className="bg-sky-50 rounded-[2.5rem] p-10 md:p-12 border border-sky-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sky-500 shrink-0 relative z-10">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-sky-600 mb-4">Seguridad de Stripe</h3>
                        <p className="text-sky-900/70 font-bold text-sm leading-relaxed mb-6">
                            TaskBounty no almacena los datos de tu tarjeta de crédito o débito en nuestros servidores.
                        </p>
                        <p className="text-sky-900/60 font-medium text-sm leading-relaxed">
                            Todas las transacciones financieras son procesadas a través de <span className="text-sky-600 font-black">Stripe</span>, líder mundial en pagos digitales. Stripe cuenta con la certificación de seguridad más estricta de la industria (PCI Nivel 1). Tu información bancaria está cifrada y protegida bajo los estándares bancarios más altos.
                        </p>
                    </div>
                </section>

                {/* Section 3 */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <Cookie className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">Cookies y Tecnologías Similares</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                        Utilizamos cookies para personalizar tu experiencia y analizar nuestro tráfico. Estas tecnologías nos permiten:
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Mantener tu sesión activa sin que tengas que reingresar tus credenciales constantemente.",
                            "Recordar tus preferencias de idioma y moneda (USD).",
                            "Entender qué secciones de la plataforma son más útiles para nuestra comunidad."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-slate-500 font-medium">
                                <span className="text-sky-500 font-black shrink-0">•</span>
                                {text}
                            </li>
                        ))}
                    </ul>
                    <p className="text-slate-400 text-xs font-medium mt-8 italic">
                        Puedes configurar tu navegador para rechazar todas las cookies, sin embargo, esto podría limitar algunas funcionalidades críticas de TaskBounty.
                    </p>
                </section>

                {/* Section 4 */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight !m-0">Derechos del Usuario</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                        Como usuario de TaskBounty, tienes pleno control sobre tu información personal. Puedes ejercer los siguientes derechos en cualquier momento:
                    </p>
                    <ul className="space-y-4">
                        {[
                            { label: "Acceso", desc: "Solicitar una copia de todos los datos que tenemos sobre ti." },
                            { label: "Rectificación", desc: "Corregir cualquier información inexacta o desactualizada." },
                            { label: "Eliminación", desc: "Solicitar el borrado permanente de tu cuenta y datos asociados (sujeto a obligaciones legales de retención de registros financieros)." },
                            { label: "Portabilidad", desc: "Recibir tus datos en un formato estructurado y legible." }
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-slate-500 font-medium">
                                <span className="text-sky-500 font-black shrink-0">•</span>
                                <div>
                                    <span className="text-slate-900 font-black block sm:inline mr-2">{item.label}:</span>
                                    {item.desc}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Contact Footer */}
                <div className="pt-20 text-center">
                    <p className="text-sm font-bold text-slate-400">
                        ¿Tienes dudas sobre nuestra política? Contáctanos en{' '}
                        <a href="mailto:privacy@taskbounty.io" className="text-sky-500 hover:text-sky-600 font-black transition-colors">
                            privacy@taskbounty.io
                        </a>
                    </p>
                </div>
            </div>
        </LegalLayout>
    );
}
