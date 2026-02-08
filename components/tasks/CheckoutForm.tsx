'use client'

import React, { useState } from 'react'
import {
    useStripe,
    useElements,
    PaymentElement
} from '@stripe/react-stripe-js'
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

export default function CheckoutForm({ taskId }: { taskId: string }) {
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
                return_url: `${window.location.origin}/tasks/${taskId}/pay/success`,
            },
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "Ocurrió un error con el pago.")
        } else {
            setMessage("Ha ocurrido un error inesperado.")
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
                className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        Pagar ahora con Escrow
                        <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
                Tu pago está protegido. El dinero solo se liberará cuando apruebes la tarea.
            </p>
        </form>
    )
}
