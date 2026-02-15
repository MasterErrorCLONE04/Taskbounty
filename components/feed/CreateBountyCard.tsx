"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/Avatar"
import { Image, Calendar, BarChart3, Loader2 } from "lucide-react"
import { createDraftTask } from "@/actions/tasks"
import { BountyDetailsModal } from "./BountyDetailsModal"

interface CreateBountyCardProps {
    user?: any
}

export function CreateBountyCard({ user }: CreateBountyCardProps) {
    const router = useRouter()
    const [bountyText, setBountyText] = useState('')
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!user) return null

    const handleConfirmBounty = async (data: {
        description: string
        requirements: string
        amount: number
        deadline: string
    }) => {
        setLoading(true)
        try {
            const result = await createDraftTask({
                title: bountyText,
                description: data.description,
                amount: data.amount,
                requirements: data.requirements,
                deadline: data.deadline
            })

            if (result.success && result.taskId) {
                router.push(`/tasks/${result.taskId}/pay?secret=${result.clientSecret}`)
            } else {
                alert('Error creating task: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
            setIsModalOpen(false)
        }
    }

    return (
        <>
            <div className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm mb-8">
                <div className="flex gap-4 mb-4">
                    <Avatar
                        src={user.avatar_url || user.user_metadata?.avatar_url}
                        fallback={user.name?.[0] || user.user_metadata?.name?.[0] || 'U'}
                        className="w-12 h-12 flex-shrink-0 border border-slate-100"
                    />
                    <div className="flex-1">
                        <textarea
                            value={bountyText}
                            onChange={(e) => setBountyText(e.target.value)}
                            disabled={loading}
                            placeholder="Post a new bounty task..."
                            className="w-full border-none focus:ring-0 text-[16px] placeholder:text-slate-400 resize-none min-h-[50px] py-2 outline-none disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pl-[60px]">
                    <div className="flex gap-3">
                        {[Image, Calendar, BarChart3].map((Icon, idx) => (
                            <button key={idx} disabled={loading} className="text-[#0095ff] hover:bg-blue-50 rounded-lg p-1.5 transition-colors disabled:opacity-50">
                                <Icon size={20} />
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!bountyText.trim() || loading}
                        className={`px-6 py-2 rounded-xl font-bold text-[14px] transition-all flex items-center gap-2 ${bountyText.trim() && !loading ? 'bg-[#0095ff] hover:bg-[#0080db] text-white shadow-md active:scale-95' : 'bg-blue-200 text-white cursor-not-allowed'
                            }`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Posting...' : 'Post Bounty'}
                    </button>
                </div>
            </div>

            <BountyDetailsModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                initialDescription={bountyText}
                onConfirmAction={handleConfirmBounty}
            />
        </>
    )
}
