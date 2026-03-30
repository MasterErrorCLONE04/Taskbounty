"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { DollarSign } from 'lucide-react'
import IncreaseCheckoutForm from '@/components/tasks/IncreaseCheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function IncreasePayTaskView({ taskId }: { taskId: string }) {
    const searchParams = useSearchParams()
    const clientSecret = searchParams.get('secret')

    if (!clientSecret) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-6">
                <div className="text-center space-y-4">
                    <p className="text-red-500 font-bold">Error: Falta el secreto de pago.</p>
                </div>
            </div>
        )
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'flat' as const,
            variables: {
                colorPrimary: '#3b82f6',
                colorBackground: '#ffffff',
                colorText: '#0f172a',
                borderRadius: '16px',
            },
        },
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
            <div className="max-w-xl w-full bg-white border border-slate-100 rounded-3xl p-10 shadow-lg space-y-8 animate-in fade-in zoom-in duration-500">
                <header className="text-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto">
                        <DollarSign className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Aumentar Bounty</h1>
                    <p className="text-slate-500 text-[15px]">
                        Ingresa los datos de tu tarjeta para retener temporalmente los fondos adicionales en el Escrow.
                    </p>
                </header>

                <div className="border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                    <Elements stripe={stripePromise} options={options}>
                        <IncreaseCheckoutForm taskId={taskId} />
                    </Elements>
                </div>
            </div>
        </div>
    )
}
