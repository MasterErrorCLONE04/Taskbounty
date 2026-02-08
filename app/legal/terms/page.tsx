'use client';

import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';

export default function TermsPage() {
    const sidebarLinks = [
        { name: 'Introducción', href: '#introduccion' },
        { name: 'Elegibilidad', href: '#elegibilidad' },
        { name: 'Sistema de Escrow', href: '#escrow' },
        { name: 'Comisiones', href: '#comisiones' },
        { name: 'Resolución de Disputas', href: '#disputas' },
        { name: 'Terminación', href: '#terminacion' },
    ];

    return (
        <LegalLayout
            title="Términos y Condiciones"
            lastUpdated="24 de Mayo, 2024"
            sidebarLinks={sidebarLinks}
        >
            <section id="introduccion" className="scroll-mt-32 mb-20">
                <h2>Introducción</h2>
                <p>
                    Bienvenido a <strong>TaskBounty</strong>. Al utilizar nuestra plataforma, usted acepta estar sujeto a estos Términos y Condiciones. Estos términos rigen su acceso y uso de la plataforma TaskBounty, incluyendo cualquier contenido, funcionalidad y servicios ofrecidos en o a través de nuestro marketplace.
                </p>
                <p>
                    Lea atentamente estos términos antes de comenzar a utilizar la plataforma. Al registrarse, usted confirma que ha leído, entendido y aceptado todos los puntos aquí descritos.
                </p>
            </section>

            <section id="elegibilidad" className="scroll-mt-32 mb-20 border-t border-slate-50 pt-20">
                <h2>Elegibilidad</h2>
                <p>Para utilizar TaskBounty, debe cumplir con los siguientes requisitos:</p>
                <ul>
                    <li>Tener al menos 18 años de edad o la mayoría de edad legal en su jurisdicción.</li>
                    <li>Poder formar contratos legalmente vinculantes.</li>
                    <li>No haber sido suspendido previamente de la plataforma.</li>
                    <li>Cumplir con todas las leyes y regulaciones locales e internacionales aplicables al comercio electrónico y servicios freelance.</li>
                </ul>
            </section>

            <section id="escrow" className="scroll-mt-32 mb-20 border-t border-slate-50 pt-20">
                <h2>Sistema de Escrow</h2>
                <p>
                    TaskBounty utiliza un sistema de depósito en garantía (Escrow) para proteger a ambas partes en cada transacción.
                </p>
                <p>
                    Al iniciar una tarea, el <strong>Cliente</strong> deposita los fondos correspondientes en la cuenta de custodia de TaskBounty. Estos fondos permanecen bloqueados y no son accesibles por el Freelancer ni retornables al Cliente unilateralmente mientras la tarea esté en progreso.
                </p>
                <p>La liberación de los fondos ocurre únicamente cuando:</p>
                <ul>
                    <li>El Cliente confirma la recepción satisfactoria del trabajo solicitado.</li>
                    <li>Se cumple el plazo de revisión automática sin que el Cliente haya presentado una queja formal.</li>
                    <li>Un mediador de TaskBounty resuelve una disputa a favor de una de las partes.</li>
                </ul>
            </section>

            <section id="comisiones" className="scroll-mt-32 mb-20 border-t border-slate-50 pt-20">
                <h2>Comisiones</h2>
                <p>
                    TaskBounty cobra una comisión por el uso de la plataforma, la cual se desglosa de la siguiente manera:
                </p>
                <p>
                    <strong>Para Clientes:</strong> Se aplica una tarifa de procesamiento de pago del 3% sobre el valor total de las tareas publicadas.
                </p>
                <p>
                    <strong>Para Freelancers:</strong> TaskBounty deduce una comisión de servicio del 10% sobre el monto final pagado por el cliente. Esta comisión nos permite mantener la infraestructura de seguridad, el soporte técnico y el sistema de mediación.
                </p>
            </section>

            <section id="disputas" className="scroll-mt-32 mb-20 border-t border-slate-50 pt-20">
                <h2>Resolución de Disputas</h2>
                <p>
                    En caso de desacuerdo entre el Cliente y el Freelancer, TaskBounty ofrece un proceso de mediación imparcial:
                </p>
                <ol>
                    <li><strong>Periodo de Negociación:</strong> Las partes tienen 48 horas para intentar resolver el conflicto de forma amistosa a través del chat interno.</li>
                    <li><strong>Intervención Humana:</strong> Si no hay acuerdo, un mediador especializado de TaskBounty revisará la descripción original de la tarea, las entregas realizadas y las comunicaciones del chat.</li>
                    <li><strong>Fallo Definitivo:</strong> La decisión del mediador es final y vinculante, pudiendo resultar en el reembolso total, pago total o pago parcial según el grado de cumplimiento.</li>
                </ol>
            </section>

            <section id="terminacion" className="scroll-mt-32 border-t border-slate-50 pt-20">
                <h2>Terminación</h2>
                <p>
                    Nos reservamos el derecho de suspender o cerrar su cuenta en cualquier momento por violación de estos términos, incluyendo pero no limitado a:
                </p>
                <ul>
                    <li>Intentar realizar pagos fuera de la plataforma (Desintermediación).</li>
                    <li>Publicar contenido ilegal, ofensivo o fraudulento.</li>
                    <li>Acoso a otros usuarios.</li>
                    <li>Múltiples disputas perdidas por negligencia o mala fe.</li>
                </ul>
            </section>
        </LegalLayout>
    );
}
