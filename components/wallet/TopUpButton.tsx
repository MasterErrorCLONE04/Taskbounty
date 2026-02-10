'use client'

import React, { useState } from 'react'
import { Download, Loader2, Plus } from 'lucide-react'
import { topUpBalance } from '@/actions/wallet'

export default function TopUpButton() {
    const [loading, setLoading] = useState(false)

    const handleTopUp = async () => {
        setLoading(true)
        try {
            const result = await topUpBalance(10)
            if (result.success) {
                alert(`¡Éxito! Tu nuevo saldo es de $${result.newBalance.toLocaleString()}`)
            }
        } catch (error) {
            alert('Error al añadir fondos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleTopUp}
            disabled={loading}
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Añadir $10 para Probar
        </button>
    )
}
