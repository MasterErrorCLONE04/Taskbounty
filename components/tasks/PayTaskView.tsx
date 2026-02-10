"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ShieldCheck } from 'lucide-react'
import CheckoutForm from '@/components/tasks/CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PayTaskView({ taskId }: { taskId: string }) {
    const searchParams = useSearchParams()
    const clientSecret = searchParams.get('secret')

    if (!clientSecret) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center space-y-4">
                    <p className="text-destructive font-bold">Error: Falta el secreto de pago.</p>
                </div>
            </div>
        )
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'flat' as const,
            variables: {
                colorPrimary: '#6366f1',
                colorBackground: '#ffffff',
                colorText: '#0f172a',
                borderRadius: '16px',
            },
        },
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <div className="max-w-xl w-full bg-card border border-border rounded-4xl p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
                <header className="text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Finalizar Publicación</h1>
                    <p className="text-muted-foreground">
                        Tu tarea está lista. Deposita el bounty en escrow para activarla en el marketplace.
                    </p>
                </header>

                <div className="border border-border/50 rounded-3xl p-2 bg-muted/5">
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm taskId={taskId} />
                    </Elements>
                </div>
            </div>
        </div>
    )
}
