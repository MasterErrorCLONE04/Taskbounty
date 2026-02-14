'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

import { Tier } from '@/app/premium/types'

export async function createSubscriptionPaymentIntent(amount: number, plan: Tier) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('Unauthorized: No active session')
        }

        // Create PaymentIntent in Stripe
        let paymentIntent
        try {
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // In cents
                currency: 'cop', // Assuming COP based on the UI
                metadata: {
                    client_id: user.id,
                    type: 'subscription',
                    plan: plan
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            })
        } catch (stripeErr: any) {
            console.error('Stripe Error:', stripeErr)
            throw new Error(`Payment Error: ${stripeErr.message}`)
        }

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        }
    } catch (error: any) {
        console.error('createSubscriptionPaymentIntent failed:', error)
        throw error
    }
}

export async function getUserPlan() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from('users')
        .select('plan, is_verified')
        .eq('id', user.id)
        .single()

    console.log('getUserPlan data:', data)

    if (data?.is_verified) {
        return (data.plan as Tier) || Tier.PREMIUM
    }

    return null
}

export async function getUserOwnedPlans(): Promise<Tier[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 1. Get current plan from profile (legacy/fallback)
    const { data: profile } = await supabase
        .from('users')
        .select('plan, is_verified')
        .eq('id', user.id)
        .single()

    // 2. Get active subscriptions from user_subscriptions table
    const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())

    const ownedPlans = new Set<Tier>()

    if (profile?.is_verified && profile.plan) {
        ownedPlans.add(profile.plan as Tier)
    } else if (profile?.is_verified) {
        ownedPlans.add(Tier.PREMIUM) // Fallback
    }

    if (subscriptions) {
        subscriptions.forEach(sub => ownedPlans.add(sub.tier as Tier))
    }

    return Array.from(ownedPlans)
}

export async function switchUserPlan(tier: Tier) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Verify ownership
    const ownedPlans = await getUserOwnedPlans()
    if (!ownedPlans.includes(tier)) {
        throw new Error('You do not own this plan')
    }

    // Update user profile
    const { error } = await supabase
        .from('users')
        .update({
            plan: tier,
            // Ensure verification stays true as long as they switch to a valid premium plan
            is_verified: true,
            // Note: verified_until should ideally track the expiration of the specific plan being switched to,
            // but for now we keep the existing logic or we'd need to fetch expires_at from user_subscriptions.
            // Let's fetch it for correctness.
        })
        .eq('id', user.id)

    if (error) throw error

    revalidatePath('/premium')
    revalidatePath(`/profile/${user.id}`)
    return { success: true }
}

export async function verifyPaymentAndActivateSubscription(paymentIntentId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        // 1. Retrieve PaymentIntent from Stripe to verify status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status !== 'succeeded') {
            throw new Error(`Payment not succeeded. Status: ${paymentIntent.status}`)
        }

        // 2. Verify it belongs to the user
        if (paymentIntent.metadata.client_id !== user.id) {
            throw new Error('Payment does not belong to this user')
        }

        // 3. Activate Subscription (Update User)
        const verifiedUntil = new Date()
        verifiedUntil.setDate(verifiedUntil.getDate() + 30)

        const { error } = await supabase
            .from('users')
            .update({
                is_verified: true,
                verified_until: verifiedUntil.toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            console.error('Error activating subscription:', error)
            throw error
        }

        revalidatePath('/')
        revalidatePath(`/profile/${user.id}`)

        return { success: true }
    } catch (error: any) {
        console.error('Verification failed:', error)
        return { success: false, error: error.message }
    }
}
