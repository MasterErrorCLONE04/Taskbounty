"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { DollarSign, Clock, Loader2, CheckCircle, X, Lock } from "lucide-react"

interface BountyDetailsModalProps {
    isOpen: boolean
    onCloseAction: () => void
    initialDescription: string
    initialCategory?: string
    onConfirmAction: (data: {
        description: string
        requirements: string
        amount: number
        deadline: string
        category: string
    }) => Promise<void>
}

export function BountyDetailsModal({ isOpen, onCloseAction, initialDescription, initialCategory = '', onConfirmAction }: BountyDetailsModalProps) {
    const [description, setDescription] = useState(initialDescription)
    const [requirements, setRequirements] = useState('')
    const [amount, setAmount] = useState('')
    const [deadline, setDeadline] = useState('7') // Default 7 days

    // Determine initial state based on hashtag
    const standardCategories = ['General', 'Code', 'Design', 'Content', 'Video']
    // Logic: if initialCategory matches standard, use it. Else if present, use 'Custom' and fill customCategory.
    // Note: We map 'Code' -> 'Development' in stats but here values are 'Code', 'Design' etc.
    // Let's check against values.
    const isStandard = standardCategories.includes(initialCategory)

    const [category, setCategory] = useState(isStandard ? initialCategory : (initialCategory ? 'Custom' : 'General'))
    const [customCategory, setCustomCategory] = useState(isStandard ? '' : initialCategory)
    const [loading, setLoading] = useState(false)

    // Sync state with prop if it changes (since modal is always mounted)
    useEffect(() => {
        const isStd = standardCategories.includes(initialCategory)
        setCategory(isStd ? initialCategory : (initialCategory ? 'Custom' : 'General'))
        setCustomCategory(isStd ? '' : initialCategory)
    }, [initialCategory])

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

        const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category

        setLoading(true)
        try {
            const deadlineDate = new Date()
            deadlineDate.setDate(deadlineDate.getDate() + parseInt(deadline))

            await onConfirmAction({
                description,
                requirements: requirements || 'To be defined',
                amount: bountyAmount,
                deadline: deadlineDate.toISOString(),
                category: finalCategory
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} hideHeader={true}>
            {/* Custom Header */}
            <div className="bg-[#F8FAFC]/50 pt-8 pb-6 px-6 text-center relative border-b border-slate-50">
                <button
                    onClick={onCloseAction}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 transition-all"
                >
                    <X size={20} />
                </button>

                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-amber-200/50">
                    <CheckCircle className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Post New Bounty</h2>
                <p className="text-sm text-slate-500 font-medium">Create a task and lock funds securely</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div>
                    <label className="block text-[15px] font-bold text-slate-900 mb-2.5">
                        Task Details
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full bg-[#F5F7F9] border border-slate-200/50 rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 outline-none resize-none min-h-[50px] font-medium transition-all text-[15px]"
                        placeholder="What needs to be done?"
                    />
                </div>

                <div>
                    <label className="block text-[15px] font-bold text-slate-900 mb-2.5">
                        Requirements
                    </label>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="w-full bg-[#F5F7F9] border border-slate-200/50 rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 outline-none resize-none min-h-[80px] font-medium transition-all text-[15px]"
                        placeholder="e.g. Needs to be a React expert, must deliver in PDF..."
                    />
                </div>

                <div>
                    <label className="block text-[15px] font-bold text-slate-900 mb-2.5">
                        Amount & Deadline
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-12 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 outline-none text-[15px] h-[52px]"
                                placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-xs font-bold text-slate-400">USD</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Clock className="h-5 w-5 text-slate-400" />
                            </div>
                            <select
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 outline-none appearance-none cursor-pointer text-[15px] h-[52px]"
                            >
                                <option value="1">24 Hours</option>
                                <option value="3">3 Days</option>
                                <option value="7">7 Days</option>
                                <option value="14">2 Weeks</option>
                                <option value="30">1 Month</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !description.trim() || !amount}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-[16px]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Lock Funds'}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="text-[12px] font-medium">Funds are secured in escrow</span>
                    </div>
                </div>
            </form>
        </Modal>
    )
}
