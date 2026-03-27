'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ShieldCheck,
    DollarSign,
    Clock,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Briefcase
} from 'lucide-react'
import { createTaskWithEscrow } from '@/actions/tasks'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface CreateTaskModalProps {
    isOpen: boolean
    onCloseAction: () => void
}

export function CreateTaskModal({ isOpen, onCloseAction }: CreateTaskModalProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        bounty_amount: '',
        deadline: '',
        category: 'General'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (parseFloat(formData.bounty_amount) < 5) {
                throw new Error('El bounty mínimo es de $5.00')
            }

            const result = await createTaskWithEscrow({
                ...formData,
                bounty_amount: parseFloat(formData.bounty_amount),
                deadline: new Date(formData.deadline).toISOString()
            })

            onCloseAction()
            router.push(`/tasks/${result.taskId}/pay?secret=${result.clientSecret}`)
        } catch (err: any) {
            setError(err.message || 'Error al crear la tarea')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Post a New Bounty" hideHeader={false}>
            <div className="p-6 md:p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase size={28} className="animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Post a New Bounty</h2>
                    <p className="text-slate-500 font-medium mt-2 text-[15px] max-w-sm mx-auto">
                        Describe your task. The exact amount will be securely held in escrow.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block ml-1" htmlFor="title">
                                Task Title
                            </label>
                            <Input
                                id="title"
                                name="title"
                                required
                                placeholder="e.g. Implement Next.js App Router"
                                className="bg-white border-slate-200 focus:bg-white transition-all text-base py-6 rounded-2xl"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block ml-1" htmlFor="description">
                                Detailed Description
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                rows={3}
                                placeholder="Explain exactly what needs to be done..."
                                className="bg-white border-slate-200 focus:bg-white transition-all resize-none text-base rounded-2xl"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block ml-1" htmlFor="requirements">
                                Deliverables (What do you expect?)
                            </label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                required
                                rows={2}
                                placeholder="e.g. GitHub Repo, Figma File, QA Report..."
                                className="bg-white border-slate-200 focus:bg-white transition-all resize-none text-base rounded-2xl"
                                value={formData.requirements}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block ml-1">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['Diseño', 'Código', 'Content', 'Video', 'General'].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all border ${formData.category === cat
                                            ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-500'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
                            <label className="text-sm font-bold flex items-center gap-1.5 text-slate-700 mb-2 ml-1" htmlFor="bounty_amount">
                                <DollarSign size={16} className="text-blue-500" /> Reward
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                                <input
                                    id="bounty_amount"
                                    name="bounty_amount"
                                    type="number"
                                    required
                                    min="5"
                                    step="0.01"
                                    placeholder="150.00"
                                    className="w-full h-14 pl-9 pr-4 rounded-2xl bg-white border border-slate-200 text-lg font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.bounty_amount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
                            <label className="text-sm font-bold flex items-center gap-1.5 text-slate-700 mb-2 ml-1" htmlFor="deadline">
                                <Clock size={16} className="text-blue-500" /> Deadline
                            </label>
                            <input
                                id="deadline"
                                name="deadline"
                                type="datetime-local"
                                required
                                className="w-full h-14 px-4 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.deadline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[13px] font-medium p-4 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-6">
                            <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
                            <p className="text-[12px] text-slate-600 font-medium leading-tight">
                                Funds are held in a secure escrow. If the freelancer fails to deliver the requirements, your money is refunded.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 group active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Confirm and Deposit
                                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
