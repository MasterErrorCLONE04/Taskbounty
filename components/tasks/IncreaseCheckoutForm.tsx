'use client'

import React, { useState } from 'react'
import {
    useStripe,
    useElements,
    PaymentElement
} from '@stripe/react-stripe-js'
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

export default function IncreaseCheckoutForm({ taskId }: { taskId: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL after payment is confirmed
                return_url: `${window.location.origin}/tasks/${taskId}/manage`,
            },
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "Ocurrió un error con el pago.")
        } else {
            setMessage("Ha ocurrido un error inesperado al procesar tu tarjeta.")
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" className="mb-6" />

            {message && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {message}
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        Concretar Aumento en Escrow
                        <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-slate-500">
                Tu pago está completamente protegido por la tecnología antifraude de Stripe y TaskBounty Escrow.
            </p>
        </form>
    )
}
