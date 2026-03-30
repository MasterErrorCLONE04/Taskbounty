'use client'

import { Wallet, Plus, ExternalLink, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { createStripeAccountLink, createStripeDashboardLink } from '@/actions/payouts'

interface PaymentMethodsListProps {
    stripeConnectId: string | null
    userEmail?: string
}

export function PaymentMethodsList({ stripeConnectId, userEmail }: PaymentMethodsListProps) {
    const [loading, setLoading] = useState(false)

    const handleAction = async () => {
        setLoading(true)
        try {
            if (stripeConnectId) {
                const url = await createStripeDashboardLink()
                window.location.href = url
            } else {
                const url = await createStripeAccountLink()
                window.location.href = url
            }
        } catch (error: any) {
            alert(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="mb-10">
            <h3 className="font-black text-slate-900 text-lg mb-6">Connected Accounts</h3>

            <div className="space-y-4">
                {/* Stripe Bank Connect */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-[15px]">Stripe Connect</p>
                            <p className="text-xs text-slate-500 font-medium">
                                {stripeConnectId ? 'Connected to your profile' : 'Not Connected'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleAction}
                disabled={loading}
                className="w-full mt-4 bg-white border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-blue-500 rounded-2xl p-4 flex items-center justify-center gap-2 font-bold transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : stripeConnectId ? (
                    <><ExternalLink className="w-5 h-5" /> Manage in Stripe</>
                ) : (
                    <><Plus className="w-5 h-5" /> Connect your Bank</>
                )}
            </button>
        </div>
    )
}
