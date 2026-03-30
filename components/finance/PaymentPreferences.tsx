'use client'

import { ExternalLink, Loader2, ShieldCheck, Banknote } from 'lucide-react'
import { useState } from 'react'
import { createStripeDashboardLink } from '@/actions/payouts'

interface PaymentPreferencesProps {
    stripeConnectId?: string | null
}

export function PaymentPreferences({ stripeConnectId }: PaymentPreferencesProps) {
    const [loading, setLoading] = useState(false)

    const handleOpenStripe = async () => {
        if (!stripeConnectId) return alert('Debes configurar una cuenta de pago primero.')
        setLoading(true)
        try {
            const url = await createStripeDashboardLink()
            window.location.href = url
        } catch (error: any) {
            alert(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="mb-10">
            <h3 className="font-black text-slate-900 text-lg mb-6">Payment Security & Preferences</h3>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">

                {/* Default Address */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Default withdrawal bank</p>
                            <p className="text-xs text-slate-500 mt-0.5">Manage which bank account receives your payouts via Stripe</p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenStripe}
                        disabled={loading || !stripeConnectId}
                        className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition-colors rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ExternalLink className="w-3.5 h-3.5" /> Manage</>}
                    </button>
                </div>

                {/* 2FA */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-lg flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Transfer Security (2FA)</p>
                            <p className="text-xs text-slate-500 mt-0.5">Edit 2-factor authentication & security for Stripe withdrawals</p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenStripe}
                        disabled={loading || !stripeConnectId}
                        className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition-colors rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ExternalLink className="w-3.5 h-3.5" /> Edit</>}
                    </button>
                </div>

            </div>

        </div>
    )
}
