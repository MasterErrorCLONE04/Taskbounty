'use client'

import React, { useState } from 'react'
import { Image, Video, Clock, FileText, Send } from 'lucide-react'
import { BountyDetailsModal } from '../feed/BountyDetailsModal'
import { useRouter } from 'next/navigation'
import { createDraftTask } from '@/actions/tasks'

export default function BountyCreator({ user }: { user: any }) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const isWorker = user?.user_metadata?.role === 'worker'
    const name = user?.email?.split('@')[0] || 'User'
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

    const handleConfirmBounty = async (data: {
        description: string
        requirements: string
        amount: number
        deadline: string
    }) => {
        setLoading(true)
        try {
            const result = await createDraftTask({
                title: data.description || 'New Bounty',
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
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
                <div className="flex gap-4 mb-5">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl px-6 text-left text-sm font-medium text-slate-400 transition-all"
                    >
                        What's the task bounty?
                    </button>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-sky-500 hover:bg-sky-50 px-3 py-2 rounded-lg transition-colors group">
                            <Image className="w-5 h-5 text-sky-400 group-hover:text-sky-500" />
                            <span className="text-xs font-bold md:block hidden">Image</span>
                        </button>
                        <button className="flex items-center gap-2 text-amber-500 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors group">
                            <Video className="w-5 h-5 text-amber-400 group-hover:text-amber-500" />
                            <span className="text-xs font-bold md:block hidden">Video</span>
                        </button>
                        <button className="flex items-center gap-2 text-indigo-500 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors group">
                            <Clock className="w-5 h-5 text-indigo-400 group-hover:text-indigo-500" />
                            <span className="text-xs font-bold md:block hidden">Urgent</span>
                        </button>
                        <button className="flex items-center gap-2 text-emerald-500 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors group">
                            <FileText className="w-5 h-5 text-emerald-400 group-hover:text-emerald-500" />
                            <span className="text-xs font-bold md:block hidden">Attached</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Post Bounty
                    </button>
                </div>
            </div>

            <BountyDetailsModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                initialDescription=""
                onConfirmAction={handleConfirmBounty}
            />
        </>
    )
}
