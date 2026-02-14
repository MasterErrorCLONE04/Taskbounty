import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
    console.log('Webhook received');
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
        console.log('Event constructed:', event.type);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    try {
        // Check for Service Role Key
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing');
            throw new Error('Server configuration error: Missing Service Role Key');
        }

        const supabase = createAdminClient()

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object
                console.log('PaymentIntent Succeeded:', paymentIntent.id, 'Metadata:', paymentIntent.metadata);

                if (paymentIntent.metadata.type === 'subscription') {
                    const userId = paymentIntent.metadata.client_id
                    const plan = paymentIntent.metadata.plan || 'premium' // Fallback for existing or missing data

                    console.log(`Processing subscription for user ${userId} to plan ${plan}`);

                    // Default to 30 days for now, can be improved with plan metadata
                    const verifiedUntil = new Date()
                    verifiedUntil.setDate(verifiedUntil.getDate() + 30)

                    // 1. Upsert into user_subscriptions to record ownership
                    const { error: subError } = await supabase
                        .from('user_subscriptions')
                        .upsert({
                            user_id: userId,
                            tier: plan,
                            expires_at: verifiedUntil.toISOString()
                        }, { onConflict: 'user_id, tier' })

                    if (subError) {
                        console.error('Error updating user_subscriptions:', subError)
                        // Don't throw, try to update users table at least
                    }

                    // 2. Update active plan in users table
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({
                            is_verified: true,
                            plan: plan,
                            verified_until: verifiedUntil.toISOString(),
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', userId)

                    if (updateError) {
                        console.error('Error updating user subscription in Supabase:', updateError)
                        throw updateError
                    }
                    console.log('User updated successfully');

                    // Force cache invalidation for premium page and profile
                    revalidatePath('/premium')
                    revalidatePath(`/profile/${userId}`)
                } else {
                    // Task Payment Logic
                    const taskId = paymentIntent.metadata.task_id
                    // const clientId = paymentIntent.metadata.client_id // Unused here

                    // 1. Payment is captured automatically (capture_method: automatic)
                    // 2, 3, 4. Update status and log state via RPC (Bypass RLS)
                    const { error: rpcError } = await supabase.rpc('activate_task_webhook', {
                        p_task_id: taskId,
                        p_payment_intent_id: paymentIntent.id
                    })

                    if (rpcError) {
                        console.error('RPC Error (activate_task_webhook):', rpcError)
                        throw rpcError
                    }

                    // 5. Revalidate paths
                    revalidatePath('/')
                    revalidatePath('/jobs')
                    revalidatePath(`/tasks/${taskId}`)
                }

                break

            case 'checkout.session.completed':
                // ... existing checkout session logic (logging omitted for brevity but should be safe if similar pattern followed)
                // Keeping existing logic but safer to wrap entire switch in try/catch which we did.
                const session = event.data.object
                if (session.metadata?.type === 'verification') {
                    const userId = session.metadata.user_id
                    const verifiedUntil = new Date()
                    verifiedUntil.setDate(verifiedUntil.getDate() + 30)
                    await supabase.from('users').update({
                        is_verified: true,
                        verified_until: verifiedUntil.toISOString(),
                        updated_at: new Date().toISOString()
                    }).eq('id', userId)
                    revalidatePath(`/profiles/${userId}`)
                }
                break

            case 'payment_intent.payment_failed':
                console.log('Payment failed:', event.data.object.id);
                break
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 })
    } catch (error: any) {
        console.error('Unhandled Webhook Error:', error);
        return new Response(`Server Error: ${error.message}`, { status: 500 });
    }
}
