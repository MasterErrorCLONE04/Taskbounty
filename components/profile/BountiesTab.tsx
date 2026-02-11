'use client'

import { useEffect, useState } from 'react'
import { BountyCard } from '@/components/feed/BountyCard'
import { getUserBounties } from '@/actions/profile'
import { AlertCircle, Loader2 } from 'lucide-react'

interface BountiesTabProps {
    userId: string
}

export function BountiesTab({ userId }: BountiesTabProps) {
    const [bounties, setBounties] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                const data = await getUserBounties(userId)
                setBounties(data)
            } catch (error) {
                console.error("Failed to fetch bounties", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBounties()
    }, [userId])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        )
    }

    if (bounties.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed mx-4 md:mx-0">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-bold text-slate-900">No active bounties</h3>
                <p className="text-slate-500">This user hasn't posted any active bounties yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 py-6 px-4 md:px-0 max-w-2xl mx-auto">
            {bounties.map((bounty) => (
                <BountyCard key={bounty.id} task={bounty} />
            ))}
        </div>
    )
}
