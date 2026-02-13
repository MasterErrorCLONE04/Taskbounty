'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

export async function createSubscriptionPaymentIntent(amount: number) {
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
                    type: 'subscription'
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
