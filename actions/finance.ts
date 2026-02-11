'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTopEarners(limit: number = 3) {
    const supabase = await createClient()

    // Query to get total earnings per worker from released payments
    // We join with users to get their profile information
    const { data, error } = await supabase
        .from('payments')
        .select(`
            worker_id,
            amount,
            status,
            worker:users!payments_worker_id_fkey (
                id,
                name,
                avatar_url
            )
        `)
        .eq('status', 'RELEASED')

    if (error) {
        console.error('Error fetching top earners:', error)
        return []
    }

    if (!data) return []

    // Group by worker and sum amounts
    const earningsMap = new Map<string, { id: string, name: string, amount: number, avatar: string }>()

    data.forEach((payment: any) => {
        const worker = payment.worker
        if (!worker) return

        const current = earningsMap.get(worker.id) || {
            id: worker.id,
            name: worker.name,
            amount: 0,
            avatar: worker.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`
        }

        current.amount += Number(payment.amount)
        earningsMap.set(worker.id, current)
    })

    // Convert map to array, sort by amount descending, and apply limit
    const topEarners = Array.from(earningsMap.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit)

    return topEarners
}
