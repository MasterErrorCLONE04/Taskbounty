'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { createStripeAccountLink, executeWithdrawal } from '@/actions/payouts'
import { Loader2, ExternalLink, Banknote, AlertCircle, CheckCircle2 } from 'lucide-react'

interface WithdrawalModalProps {
    isOpen: boolean
    onCloseAction: () => void
    availableBalance: number
    stripeConnectId: string | null
}

export function WithdrawalModal({ isOpen, onCloseAction, availableBalance, stripeConnectId }: WithdrawalModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Reset state when opening
    React.useEffect(() => {
        if (isOpen) {
            setLoading(false)
            setError(null)
            setSuccess(false)
        }
    }, [isOpen])

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
        setLoading(true)
        setError(null)
        try {
            await executeWithdrawal(availableBalance)
            setSuccess(true)
            setTimeout(() => {
                onCloseAction()
                // Ideally trigger a refresh of the parent data here
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Error processing withdrawal.')
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Withdraw Funds">
            <div className="p-6 space-y-6">
                {!stripeConnectId ? (
                    <div className="text-center space-y-4">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <Banknote className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900">Connect to Stripe</h4>
                            <p className="text-sm text-slate-500 mt-2">
                                To withdraw your earnings, you first need to connect a Stripe account.
                            </p>
                        </div>
                        <button
                            onClick={handleOnboarding}
                            disabled={loading}
                            className="w-full bg-[#0095ff] hover:bg-[#0080db] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <ExternalLink className="w-5 h-5" />
                                    Connect Stripe
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                            <p className="text-sm text-slate-500 font-medium mb-1">Available to Withdraw</p>
                            <div className="text-3xl font-black text-slate-900">
                                ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm text-slate-400 font-bold">USD</span>
                            </div>
                        </div>

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-green-700">Withdrawal Initiated!</h4>
                                <p className="text-sm text-green-600">Your funds are on the way.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-3 px-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Total Withdrawal</span>
                                        <span className="font-medium text-slate-900">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Platform Fee (15%)</span>
                                        <span className="font-medium text-red-500">-${(availableBalance * 0.15).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex justify-between text-[15px] font-bold">
                                        <span className="text-slate-900">You Receive</span>
                                        <span className="text-green-600">${(availableBalance * 0.85).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 text-center px-4">
                                    Funds will be transferred to your connected Stripe account immediately.
                                </p>
                                <button
                                    onClick={handleWithdrawal}
                                    disabled={loading || availableBalance <= 0}
                                    className="w-full bg-[#0095ff] hover:bg-[#0080db] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <Banknote className="w-5 h-5" />
                                            Withdraw Full Amount
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}
            </div>
        </Modal>
    )
}
