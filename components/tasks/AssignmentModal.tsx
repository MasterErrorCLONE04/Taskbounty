'use client'

import React from 'react'
import { X, Info, Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'

interface AssignmentModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    candidateName: string
    bountyAmount: number
    deadline: string
    isProcessing: boolean
}

export default function AssignmentModal({
    isOpen,
    onClose,
    onConfirm,
    candidateName,
    bountyAmount,
    deadline,
    isProcessing
}: AssignmentModalProps) {
    if (!isOpen) return null

    // Use portal to render at root level (optional, but good for modals)
    // For simplicity in this step, returning direct JSX is fine, but portal is better if layout has overflow:hidden
    // sticking to direct return for now unless layout issues arise, or typically document.body

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" role="dialog" aria-modal="true">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        Assign task to {candidateName}?
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Details Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">Bounty Amount</span>
                            <span className="text-lg font-black text-slate-900">${bountyAmount} USDC</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                            <span className="text-sm font-medium text-slate-500">Delivery Deadline</span>
                            <span className="text-md font-bold text-slate-900">
                                {new Date(deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Info Warning */}
                    <div className="flex gap-3 p-4 bg-blue-50 rounded-2xl">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[12px] text-blue-700 font-medium leading-relaxed">
                            By assigning this task, the funds currently in Escrow will be reserved for this hunter.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm Assignment'
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
