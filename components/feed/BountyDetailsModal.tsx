"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { DollarSign, Clock, FileText, AlignLeft, Loader2 } from "lucide-react"

interface BountyDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    initialDescription: string
    onConfirm: (data: {
        description: string
        requirements: string
        amount: number
        deadline: string
    }) => Promise<void>
}

export function BountyDetailsModal({ isOpen, onClose, initialDescription, onConfirm }: BountyDetailsModalProps) {
    const [description, setDescription] = useState(initialDescription)
    const [requirements, setRequirements] = useState('')
    const [amount, setAmount] = useState('')
    const [deadline, setDeadline] = useState('7') // Default 7 days
    const [loading, setLoading] = useState(false)

    // Update description if initialDescription changes (when coming from composer)
    // Actually, we usually want to set it once when opening. 
    // But since it's a modal that opens many times, we can rely on props or useEffect.
    // However, if we use a key on the modal in the parent, it will reset.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const bountyAmount = parseFloat(amount)
        if (isNaN(bountyAmount) || bountyAmount <= 0) {
            alert('Please enter a valid amount.')
            return
        }

        setLoading(true)
        try {
            const deadlineDate = new Date()
            deadlineDate.setDate(deadlineDate.getDate() + parseInt(deadline))

            await onConfirm({
                description,
                requirements: requirements || 'To be defined',
                amount: bountyAmount,
                deadline: deadlineDate.toISOString()
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Post Your Bounty">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
                        <AlignLeft className="w-4 h-4 text-blue-500" />
                        Task Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none min-h-[100px] font-medium"
                        placeholder="What needs to be done?"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Requirements
                    </label>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none min-h-[80px] font-medium"
                        placeholder="e.g. Needs to be a React expert, must deliver in PDF..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
                            <DollarSign className="w-4 h-4 text-blue-500" />
                            Bounty Amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-10 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="0.00"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">USD</span>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
                            <Clock className="w-4 h-4 text-blue-500" />
                            Time Remaining
                        </label>
                        <select
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer"
                        >
                            <option value="1">24 Hours</option>
                            <option value="3">3 Days</option>
                            <option value="7">1 Week</option>
                            <option value="14">2 Weeks</option>
                            <option value="30">1 Month</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading || !description.trim() || !amount}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Post Bounty'}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-medium mt-4 uppercase tracking-widest">
                        Funds will be held in escrow until completion
                    </p>
                </div>
            </form>
        </Modal>
    )
}
