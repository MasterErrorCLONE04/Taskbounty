'use client'

import React, { useState } from 'react'
import { createStripeAccountLink, executeWithdrawal } from '@/actions/payouts'
import { Loader2, ExternalLink, Banknote, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function PayoutButtons({
    stripeId,
    availableBalance
}: {
    stripeId: string | null,
    availableBalance: number
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleOnboarding = async () => {
        setLoading(true)
        setError(null)
        try {
            const url = await createStripeAccountLink()
            window.location.href = url
        } catch (err: any) {
            setError(err.message || 'Error al iniciar el onboarding de Stripe.')
            setLoading(false)
        }
    }

    const handleWithdrawal = async () => {
        if (!confirm(`¿Estás seguro de que quieres retirar $${availableBalance}?`)) return

        setLoading(true)
        setError(null)
        try {
            await executeWithdrawal(availableBalance)
            setSuccess(true)
            // The page will revalidate via server action, but we show success local state
        } catch (err: any) {
            setError(err.message || 'Error al procesar el retiro.')
        } finally {
            setLoading(false)
        }
    }

    if (!stripeId) {
        return (
            <div className="space-y-4">
                <button
                    onClick={handleOnboarding}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                            <ExternalLink className="w-4 h-4" />
                            Configurar Retiros (Stripe)
                        </>
                    )}
                </button>
                {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleWithdrawal}
                disabled={loading || availableBalance <= 0 || success}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? (
                    <>
                        <CheckCircle2 className="w-4 h-4" />
                        Retiro Solicitado
                    </>
                ) : (
                    <>
                        <Banknote className="w-4 h-4" />
                        Retirar Saldo (${availableBalance.toLocaleString()})
                    </>
                )}
            </button>

            {error && (
                <div className="flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 p-2 rounded-lg">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 text-xs text-green-500 font-medium bg-green-500/10 p-2 rounded-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    ¡Retiro enviado con éxito!
                </div>
            )}
        </div>
    )
}
