"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/Avatar"
import { Image, Calendar, FileText, Loader2 } from "lucide-react"
import { createDraftTask } from "@/actions/tasks"

interface CreateBountyCardProps {
    user?: any
}

export function CreateBountyCard({ user }: CreateBountyCardProps) {
    const router = useRouter()
    const [bountyText, setBountyText] = useState('')
    const [bountyAmount, setBountyAmount] = useState('')
    const [loading, setLoading] = useState(false)

    if (!user) return null

    const handlePost = async () => {
        if (!bountyText.trim()) return
        const amount = parseFloat(bountyAmount)
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid bounty amount greater than 0.')
            return
        }

        setLoading(true)
        try {
            const result = await createDraftTask(bountyText, amount)
            if (result.success && result.taskId) {
                // Redirect directly to payment page to activate the task
                router.push(`/tasks/${result.taskId}/pay`)
            } else {
                alert('Error creating task: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 border-b border-slate-100 bg-white mb-6">
            <div className="flex gap-4">
                <Avatar
                    src={user.user_metadata?.avatar_url}
                    fallback={user.user_metadata?.name?.[0] || 'U'}
                    className="w-12 h-12 flex-shrink-0 border border-slate-100"
                />
                <div className="flex-1 space-y-3">
                    <textarea
                        value={bountyText}
                        onChange={(e) => setBountyText(e.target.value)}
                        disabled={loading}
                        placeholder="Describe your task to get started..."
                        className="w-full border-none focus:ring-0 text-lg placeholder:text-slate-400 resize-none min-h-[60px] py-2 outline-none disabled:opacity-50"
                    />

                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-sm font-bold text-slate-500">Bounty Offer:</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                            <span className="text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                min="1"
                                value={bountyAmount}
                                onChange={(e) => setBountyAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-24 outline-none font-bold text-slate-900 bg-transparent text-sm"
                            />
                            <span className="text-xs font-bold text-slate-400">USD</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                        <div className="flex gap-1">
                            {[Image, Calendar, FileText].map((Icon, idx) => (
                                <button key={idx} disabled={loading} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handlePost}
                            disabled={!bountyText.trim() || !bountyAmount || loading}
                            className={`px-5 py-2 rounded-full font-bold text-[14px] transition-all flex items-center gap-2 ${bountyText.trim() && bountyAmount && !loading ? 'bg-blue-500 text-white shadow-md shadow-blue-100 hover:bg-blue-600' : 'bg-blue-200 text-white cursor-not-allowed'
                                }`}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Processing...' : 'Post Bounty'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
