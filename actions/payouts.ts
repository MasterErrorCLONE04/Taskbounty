'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

/**
 * Creates a Stripe Account Link for Express onboarding
 */
export async function createStripeAccountLink() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Get user profile
    const { data: profile } = await supabase
        .from('users')
        .select('stripe_connect_id, email')
        .eq('id', user.id)
        .single()

    let connectId = profile?.stripe_connect_id

    // 2. Create account if doesn't exist
    if (!connectId) {
        const account = await stripe.accounts.create({
            type: 'express',
            email: profile?.email || user.email,
            capabilities: {
                transfers: { requested: true },
            },
            metadata: {
                user_id: user.id
            }
        })
        connectId = account.id

        // Update user in DB
        await supabase
            .from('users')
            .update({ stripe_connect_id: connectId })
            .eq('id', user.id)
    }

    // 3. Create Account Link
    const host = (await headers()).get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    const accountLink = await stripe.accountLinks.create({
        account: connectId,
        refresh_url: `${origin}/?stripe_error=true`,
        return_url: `${origin}/?stripe_success=true`,
        type: 'account_onboarding',
    })

    return accountLink.url
}

/**
 * Executes a withdrawal from the user's TaskBounty balance to their Stripe account
 */
export async function executeWithdrawal(amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Verify balance and Stripe ID
    const { data: profile } = await supabase
        .from('users')
        .select('stripe_connect_id')
        .eq('id', user.id)
        .single()

    if (!profile?.stripe_connect_id) throw new Error('Debes vincular una cuenta de Stripe antes de retirar.')

    const { data: balance } = await supabase
        .from('balances')
        .select('available_balance')
        .eq('user_id', user.id)
        .single()

    if (!balance || balance.available_balance < amount) {
        throw new Error('Saldo insuficiente para retirar esta cantidad.')
    }

    if (amount < 1) throw new Error('El retiro mínimo es de $1.00')

    // 2. Record the withdrawal in PENDING state
    const { data: withdrawal, error: wError } = await supabase
        .from('withdrawals')
        .insert({
            user_id: user.id,
            amount,
            status: 'PENDING'
        })
        .select()
        .single()

    if (wError) throw wError

    try {
        // 3. Deduct from platform balance
        const { error: bError } = await supabase.rpc('deduct_balance', {
            p_user_id: user.id,
            p_amount: amount
        })

        if (bError) throw bError

        // 4. Create Stripe Transfer
        const transfer = await stripe.transfers.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            destination: profile.stripe_connect_id,
            description: `Transferencia TaskBounty - ID: ${withdrawal.id}`,
            metadata: {
                withdrawal_id: withdrawal.id,
                user_id: user.id
            }
        })

        // 5. Update withdrawal record
        await supabase
            .from('withdrawals')
            .update({
                status: 'COMPLETED',
                stripe_transfer_id: transfer.id
            })
            .eq('id', withdrawal.id)

        revalidatePath('/')
        return { success: true, transferId: transfer.id }

    } catch (err: any) {
        // Rollback balance if transfer failed (Optional: depending on deduct_balance implementation)
        // For MVP, we'll mark as FAILED
        await supabase
            .from('withdrawals')
            .update({ status: 'FAILED' })
            .eq('id', withdrawal.id)

        throw new Error(`Error en el retiro: ${err.message}`)
    }
}
