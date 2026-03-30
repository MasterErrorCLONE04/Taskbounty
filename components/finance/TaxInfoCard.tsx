'use client'

import { FileText, Loader2, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { createStripeDashboardLink } from '@/actions/payouts'

interface TaxInfoCardProps {
    stripeConnectId?: string | null
}

export function TaxInfoCard({ stripeConnectId }: TaxInfoCardProps) {
    const [loading, setLoading] = useState(false)

    const handleOpenStripe = async () => {
        if (!stripeConnectId) return alert('Debes conectar una cuenta bancaria antes de gestionar impuestos.')
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
            <h3 className="font-black text-slate-900 text-lg mb-6">Tax Information</h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-sm">
                            Tax Forms & Reports
                        </p>
                        <p className="font-medium text-slate-500 text-xs mt-0.5">
                            Automatically managed securely via Stripe Express (e.g. W-9/1099)
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleOpenStripe}
                    disabled={loading || !stripeConnectId}
                    className="text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 hover:bg-slate-200 transition-colors rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4" /> Manage in Stripe</>}
                </button>
            </div>
        </div>
    )
}
