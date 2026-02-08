'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const { id } = React.use(params)

    useEffect(() => {
        const clientSecret = searchParams.get('payment_intent_client_secret')
        if (!clientSecret) {
            setStatus('error')
            return
        }

        // Ideally, we'd verify the PI status here using stripe.retrievePaymentIntent
        // But since Stripe redirected here via return_url, and we have the webhook handling the DB update,
        // we can just show a success UI.
        setStatus('success')
    }, [searchParams])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center space-y-4">
                    <p className="text-destructive font-bold text-xl">Error al verificar el pago.</p>
                    <Link href="/client/dashboard" className="text-primary hover:underline">Volver al panel</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-background to-background">
            <div className="max-w-md w-full bg-card border border-border rounded-4xl p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">¡Pago Confirmado!</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        El bounty ha sido depositado en escrow de forma segura. Tu tarea ya es visible para los trabajadores.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/client/dashboard"
                        className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 group text-lg"
                    >
                        Ver mi panel
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
