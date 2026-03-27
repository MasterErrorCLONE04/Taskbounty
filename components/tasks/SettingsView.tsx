'use client'

import React, { useState, useTransition } from 'react'
import { Calendar, DollarSign, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { updateTask, cancelTask, increaseBounty } from '@/actions/tasks'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useToast } from '@/components/ui/ToastProvider'

interface SettingsViewProps {
    task: any
}

const SettingsView: React.FC<SettingsViewProps> = ({ task }) => {
    const [isPending, startTransition] = useTransition()
    const [isPublic, setIsPublic] = useState(task.is_public ?? true)
    const [allowLate, setAllowLate] = useState(task.allow_late_submissions ?? false)
    const [deadline, setDeadline] = useState(new Date(task.deadline).toISOString().split('T')[0])
    const [additionalAmount, setAdditionalAmount] = useState('')
    const [isCancelling, setIsCancelling] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const { toast } = useToast()

    const handleUpdate = (updates: any) => {
        startTransition(async () => {
            try {
                await updateTask(task.id, updates)
            } catch (err: any) {
                toast(err.message || 'Error al actualizar la tarea', 'error')
            }
        })
    }

    const handleIncreaseBounty = () => {
        const amount = parseFloat(additionalAmount)
        if (isNaN(amount) || amount <= 0) {
            toast('Por favor ingresa un monto válido', 'warning')
            return
        }

        startTransition(async () => {
            try {
                await increaseBounty(task.id, amount)
                setAdditionalAmount('')
                toast(`¡Bounty aumentado! Nuevo total: $${Number(task.bounty_amount) + amount}`, 'success')
            } catch (err: any) {
                toast(err.message || 'Error al aumentar el bounty', 'error')
            }
        })
    }

    const handleCancelConfirm = async () => {
        setIsCancelling(true)
        try {
            await cancelTask(task.id)
            window.location.href = '/'
        } catch (err: any) {
            toast(err.message || 'Error al cancelar la tarea', 'error')
            setIsCancelling(false)
            setShowCancelModal(false)
        }
    }

    const Toggle = ({ enabled, setEnabled, onChange }: {
        enabled: boolean,
        setEnabled: (v: boolean) => void,
        onChange: (v: boolean) => void
    }) => (
        <button
            disabled={isPending}
            onClick={() => {
                const newValue = !enabled
                setEnabled(newValue)
                onChange(newValue)
            }}
            className={`relative inline-flex h-[22px] w-[42px] items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${enabled ? 'bg-blue-500' : 'bg-slate-300'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
    )

    return (
        <>
            <div className="flex flex-col gap-4 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Visibility Toggle */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-slate-900 text-[15px]">Visibility</h4>
                        <p className="text-[13px] text-slate-500 mt-0.5">Decide if this task is public or private</p>
                    </div>
                    <Toggle
                        enabled={isPublic}
                        setEnabled={setIsPublic}
                        onChange={(v) => handleUpdate({ is_public: v })}
                    />
                </div>

                {/* Late Submissions Toggle */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-slate-900 text-[15px]">Allow late submissions</h4>
                        <p className="text-[13px] text-slate-500 mt-0.5">Enable work submission after the deadline</p>
                     </div>
                    <Toggle
                        enabled={allowLate}
                        setEnabled={setAllowLate}
                        onChange={(v) => handleUpdate({ allow_late_submissions: v })}
                    />
                </div>

                {/* Update Deadline */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5">
                    <h4 className="font-semibold text-slate-900 text-[15px]">Update Deadline</h4>
                    <p className="text-[13px] text-slate-500 mt-0.5 mb-4">Change the final submission date</p>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => {
                                const newDate = e.target.value
                                setDeadline(newDate)
                                handleUpdate({ deadline: newDate })
                            }}
                            disabled={isPending}
                            className="w-full border border-slate-100 rounded-[10px] py-2.5 pl-11 pr-4 text-[14px] text-slate-900 transition-all disabled:opacity-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Increase Bounty */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5">
                    <h4 className="font-semibold text-slate-900 text-[15px]">Increase Bounty</h4>
                    <p className="text-[13px] text-slate-500 mt-0.5 mb-4">Add more funds to the current escrow</p>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="number"
                                placeholder="Additional amount"
                                value={additionalAmount}
                                onChange={(e) => setAdditionalAmount(e.target.value)}
                                disabled={isPending}
                                className="w-full border border-slate-100 rounded-[10px] py-2.5 pl-11 pr-4 text-[14px] text-slate-900 transition-all disabled:opacity-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            onClick={handleIncreaseBounty}
                            disabled={isPending || !additionalAmount}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 active:scale-[0.98] text-white px-6 py-2.5 rounded-[10px] font-semibold text-[14px] transition-all flex items-center justify-center min-w-[120px]"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Add Funds'}
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 border-t border-slate-50 pt-8">
                    <h3 className="text-[12px] font-bold text-red-600 uppercase tracking-widest mb-4">Danger Zone</h3>
                    <div className="bg-[#fff5f5] border border-red-100/50 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-slate-900 text-[15px]">Cancel Task</h4>
                            <p className="text-[13px] text-slate-600 mt-0.5">This will refund the bounty and close the task forever.</p>
                        </div>
                        <button
                            onClick={() => setShowCancelModal(true)}
                            disabled={isCancelling}
                            className="border border-red-500 text-red-600 hover:bg-red-50 bg-white px-6 py-2 rounded-xl font-bold text-[13px] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                        >
                            {isCancelling ? <Loader2 size={16} className="animate-spin" /> : 'Cancel Task'}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showCancelModal}
                onCloseAction={() => setShowCancelModal(false)}
                onConfirmAction={handleCancelConfirm}
                title="¿Cancelar esta tarea?"
                description="El bounty será devuelto a tu balance y la tarea se cerrará permanentemente. Esta acción no se puede deshacer."
                confirmText="Sí, cancelar tarea"
                cancelText="No, mantener"
                variant="danger"
                isLoading={isCancelling}
            />
        </>
    )
}

export default SettingsView
