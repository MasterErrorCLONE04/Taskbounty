'use client'

import React, { useState, useTransition } from 'react'
import { Calendar, DollarSign, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { updateTask, cancelTask, increaseBounty } from '@/actions/tasks'

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

    const handleUpdate = (updates: any) => {
        startTransition(async () => {
            try {
                await updateTask(task.id, updates)
            } catch (err: any) {
                alert(err.message || 'Error al actualizar la tarea')
            }
        })
    }

    const handleIncreaseBounty = () => {
        const amount = parseFloat(additionalAmount)
        if (isNaN(amount) || amount <= 0) {
            alert('Por favor ingresa un monto válido')
            return
        }

        startTransition(async () => {
            try {
                await increaseBounty(task.id, amount)
                setAdditionalAmount('')
                alert(`¡Bounty aumentado exitosamente! Nuevo total: $${Number(task.bounty_amount) + amount}`)
            } catch (err: any) {
                alert(err.message || 'Error al aumentar el bounty')
            }
        })
    }

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que quieres cancelar esta tarea? El bounty será devuelto a tu balance.')) return

        setIsCancelling(true)
        try {
            await cancelTask(task.id)
            window.location.href = '/' // Redirect to home after cancellation
        } catch (err: any) {
            alert(err.message || 'Error al cancelar la tarea')
        } finally {
            setIsCancelling(false)
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${enabled ? 'bg-blue-500' : 'bg-slate-200'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    )

    return (
        <div className="flex flex-col gap-6 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Visibility Toggle */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
                <div>
                    <h4 className="font-black text-slate-900 tracking-tight">Visibility</h4>
                    <p className="text-sm text-slate-400 font-medium">Decide if this task is public or private</p>
                </div>
                <Toggle
                    enabled={isPublic}
                    setEnabled={setIsPublic}
                    onChange={(v) => handleUpdate({ is_public: v })}
                />
            </div>

            {/* Late Submissions Toggle */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
                <div>
                    <h4 className="font-black text-slate-900 tracking-tight">Allow late submissions</h4>
                    <p className="text-sm text-slate-400 font-medium">Enable work submission after the deadline</p>
                </div>
                <Toggle
                    enabled={allowLate}
                    setEnabled={setAllowLate}
                    onChange={(v) => handleUpdate({ allow_late_submissions: v })}
                />
            </div>

            {/* Update Deadline */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                <h4 className="font-black text-slate-900 tracking-tight">Update Deadline</h4>
                <p className="text-sm text-slate-400 font-medium mb-4">Change the final submission date</p>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => {
                            const newDate = e.target.value
                            setDeadline(newDate)
                            handleUpdate({ deadline: newDate })
                        }}
                        disabled={isPending}
                        className="w-full border border-slate-100 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Increase Bounty */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                <h4 className="font-black text-slate-900 tracking-tight">Increase Bounty</h4>
                <p className="text-sm text-slate-400 font-medium mb-4">Add more funds to the current escrow</p>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            placeholder="Additional amount"
                            value={additionalAmount}
                            onChange={(e) => setAdditionalAmount(e.target.value)}
                            disabled={isPending}
                            className="w-full border border-slate-100 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all disabled:opacity-50"
                        />
                    </div>
                    <button
                        onClick={handleIncreaseBounty}
                        disabled={isPending || !additionalAmount}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 active:scale-95 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        {isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        Add Funds
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-4">
                <h3 className="text-[10px] font-black text-red-500 tracking-widest uppercase mb-4 ml-4">Danger Zone</h3>
                <div className="bg-red-50/20 border border-red-100 rounded-[2rem] p-6 flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-slate-900 tracking-tight">Cancel Task</h4>
                        <p className="text-sm text-slate-400 font-medium">This will refund the bounty and close the task forever.</p>
                    </div>
                    <button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="border-2 border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isCancelling ? <Loader2 size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
                        Cancel Task
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsView
