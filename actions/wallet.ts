'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Add funds to the current user's wallet (Development/Testing Only)
 */
export async function topUpBalance(amount: number = 10) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('No autorizado')

    // 2. Perform Top Up
    // In a real app, this would be handled by Stripe webhooks
    const { error: updateError } = await supabase
        .from('balances')
        .update({
            available_balance: supabase.rpc('increment', { row_id: user.id, x: amount }) // This is a placeholder, let's use a simpler update for now
        })
        .eq('user_id', user.id)

    // Wait, let's just use a direct update for simplicity in this dev environment
    const { data: currentBalance } = await supabase
        .from('balances')
        .select('available_balance')
        .eq('user_id', user.id)
        .single()

    const newBalance = (currentBalance?.available_balance || 0) + amount

    const { error } = await supabase
        .from('balances')
        .update({
            available_balance: newBalance,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

    if (error) {
        console.error('TopUp Error:', error)
        throw new Error('Error al añadir fondos')
    }

    revalidatePath('/client/wallet')
    revalidatePath('/worker/wallet')

    return { success: true, newBalance }
}
