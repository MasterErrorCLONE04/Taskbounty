'use client'

import React, { useState, useEffect } from 'react'
import { createStripeAccountLink, executeWithdrawal } from '@/actions/payouts'
import { Loader2, ExternalLink, Banknote, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface WithdrawalConfigProps {
    availableBalance: number
    stripeConnectId: string | null
    userEmail: string
}

export function WithdrawalConfig({ availableBalance, stripeConnectId, userEmail }: WithdrawalConfigProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Amount state
    const [withdrawAmount, setWithdrawAmount] = useState<string>('')
    const [parsedAmount, setParsedAmount] = useState<number>(0)

    // Update parsed amount when input changes
    useEffect(() => {
        const value = parseFloat(withdrawAmount) || 0
        setParsedAmount(value)
    }, [withdrawAmount])

    const fee = parsedAmount * 0.15
    const netAmount = parsedAmount - fee
    // const transactionFee = 0 // Mocked for now if needed
    const isValidAmount = parsedAmount > 0 && parsedAmount <= availableBalance

    const handleOnboarding = async () => {
        setLoading(true)
        setError(null)
        try {
            const url = await createStripeAccountLink()
            window.location.href = url
        } catch (err: any) {
            setError(err.message || 'Error initializing Stripe onboarding.')
            setLoading(false)
        }
    }

    const handleWithdrawal = async () => {
        if (!isValidAmount) return
        if (!confirm(`Are you sure you want to withdraw $${parsedAmount.toFixed(2)}?`)) return

        setLoading(true)
        setError(null)
        try {
            await executeWithdrawal(parsedAmount)
            setSuccess(true)
            setTimeout(() => {
                router.push('/wallet')
                router.refresh()
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Error processing withdrawal.')
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="max-w-xl mx-auto py-12 px-6 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Withdrawal Initiated!</h2>
                <p className="text-lg text-slate-500 mb-10">
                    Your funds of <span className="font-black text-slate-900">${parsedAmount.toFixed(2)}</span> are on the way to your connected wallet.
                </p>
                <button
                    onClick={() => {
                        setSuccess(false)
                        setWithdrawAmount('')
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all"
                >
                    Make another withdrawal
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-6">
            <div className="flex items-center gap-4 mb-10">
                <Link href="/profile" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Withdraw Funds</h1>
            </div>

            {/* Balance Display */}
            <div className="text-center mb-12">
                <p className="text-slate-500 font-medium mb-2">Available Balance</p>
                <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                        ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xl font-black text-slate-400">USDC</span>
                </div>
            </div>

            {!stripeConnectId ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Banknote className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Connect a Wallet</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                        Link your Stripe account to start withdrawing funds securely.
                    </p>
                    <button
                        onClick={handleOnboarding}
                        disabled={loading}
                        className="bg-[#0095ff] hover:bg-[#0080db] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Connect Stripe'}
                    </button>
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Amount Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                            Withdraw Amount
                        </label>
                        <div className="relative group">
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl py-5 pl-8 pr-20 text-3xl font-black text-slate-900 outline-none transition-all placeholder:text-slate-300"
                                placeholder="0.00"
                            />
                            <button
                                onClick={() => setWithdrawAmount(availableBalance.toString())}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {/* Destination Tabs */}
                    <div>
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                            Destination Wallet
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 border-2 border-blue-500 bg-blue-50/50 text-blue-600 py-4 rounded-xl font-bold transition-all">
                                <Banknote className="w-5 h-5" />
                                Connected Wallet
                            </button>
                            <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-600 hover:border-slate-300 py-4 rounded-xl font-bold transition-all" onClick={handleOnboarding}>
                                <ExternalLink className="w-5 h-5" />
                                New Address
                            </button>
                        </div>
                        <div className="mt-3">
                            <input
                                disabled
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                                value={`Stripe Account: ${userEmail}`} // Simplified visualisation
                            />
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                            <span>Network Fee (Ethereum)</span>
                            <span>12.50 USDC</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                            <span>Service Fee (15%)</span>
                            <span>{fee.toFixed(2)} USDC</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2" />
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">Total to Receive</span>
                            <span className="text-xl font-black text-[#0095ff]">{netAmount > 0 ? netAmount.toFixed(2) : '0.00'} USDC</span>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleWithdrawal}
                        disabled={loading || !isValidAmount}
                        className="w-full bg-[#0095ff] hover:bg-[#0080db] text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Confirm Withdrawal'}
                    </button>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            <span className="font-bold">Security Note:</span> Funds are transferred instantly via Stripe Connect. Double-check your destination account in the Stripe Dashboard.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
