
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function PaymentPreferences() {
    const [preferences, setPreferences] = useState({
        defaultAddress: true,
        autoStake: false,
        twoFactor: true
    })

    const toggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="mb-10">
            <h3 className="font-black text-slate-900 text-lg mb-6">Payment Preferences</h3>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">

                {/* Default Address */}
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 text-sm mb-1">Default withdrawal address</p>
                        <p className="text-xs text-slate-500">Always use main wallet for automated payouts</p>
                    </div>
                    <button
                        onClick={() => toggle('defaultAddress')}
                        className={`w-12 h-7 rounded-full transition-colors relative ${preferences.defaultAddress ? 'bg-blue-500' : 'bg-slate-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${preferences.defaultAddress ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>

                {/* Auto-stake */}
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 text-sm mb-1">Auto-stake earnings</p>
                        <p className="text-xs text-slate-500">Automatically stake 20% of bounty rewards</p>
                    </div>
                    <button
                        onClick={() => toggle('autoStake')}
                        className={`w-12 h-7 rounded-full transition-colors relative ${preferences.autoStake ? 'bg-blue-500' : 'bg-slate-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${preferences.autoStake ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>

                {/* 2FA */}
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 text-sm mb-1">Two-factor authentication for withdrawals</p>
                        <p className="text-xs text-slate-500">Required for all transactions over $100</p>
                    </div>
                    <button
                        onClick={() => toggle('twoFactor')}
                        className={`w-12 h-7 rounded-full transition-colors relative ${preferences.twoFactor ? 'bg-blue-500' : 'bg-slate-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${preferences.twoFactor ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>

            </div>

            <div className="mt-8">
                <h3 className="font-black text-slate-900 text-lg mb-4">Currency Preference</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Preferred Display Currency</p>
                <div className="relative">
                    <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors">
                        <option>USDC (USD Coin)</option>
                        <option>ETH (Ethereum)</option>
                        <option>BTC (Bitcoin)</option>
                        <option>USD (Fiat)</option>
                    </select>
                    <ChevronDown className="bg-slate-50 w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}
