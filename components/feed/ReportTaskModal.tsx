
'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { reportTask } from '@/actions/reports'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'

interface ReportTaskModalProps {
    isOpen: boolean
    onClose: () => void
    taskId: string
}

export function ReportTaskModal({ isOpen, onClose, taskId }: ReportTaskModalProps) {
    const [reason, setReason] = useState('')
    const [details, setDetails] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const reasons = [
        'Spam or misleading',
        'Illegal content',
        'Harassment or hate speech',
        'Payment issue',
        'Other'
    ]

    const handleSubmit = async () => {
        if (!reason) return

        setIsSubmitting(true)
        const { success } = await reportTask(taskId, reason, details)
        setIsSubmitting(false)

        if (success) {
            setIsSuccess(true)
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
                setReason('')
                setDetails('')
            }, 2000)
        } else {
            alert('Failed to submit report. Please try again.')
        }
    }

    if (isSuccess) {
        return (
            <Modal isOpen={isOpen} onCloseAction={onClose} title="Report Submitted">
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-black text-2xl text-slate-900 mb-2">Thank you!</h3>
                    <p className="text-slate-500">We have received your report and will review it shortly.</p>
                </div>
            </Modal>
        )
    }

    return (
        <Modal isOpen={isOpen} onCloseAction={onClose} title="Report Task">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800 font-medium">Why are you reporting this task?</p>
                </div>

                <div className="space-y-3 mb-6">
                    {reasons.map((r) => (
                        <label key={r} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${reason === r
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}>
                            <input
                                type="radio"
                                name="reportReason"
                                value={r}
                                checked={reason === r}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className={`ml-3 text-sm font-bold ${reason === r ? 'text-blue-900' : 'text-slate-700'}`}>
                                {r}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-900 mb-2">Additional Details (Optional)</label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-24 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none text-sm p-3"
                        placeholder="Please provide any extra context..."
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reason || isSubmitting}
                        className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Submit Report
                    </button>
                </div>
            </div>
        </Modal>
    )
}
