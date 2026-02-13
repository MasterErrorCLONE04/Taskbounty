import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const supabase = await createClient()

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object

            if (paymentIntent.metadata.type === 'subscription') {
                const userId = paymentIntent.metadata.client_id

                // Default to 30 days for now, can be improved with plan metadata
                const verifiedUntil = new Date()
                verifiedUntil.setDate(verifiedUntil.getDate() + 30)

                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        is_verified: true,
                        verified_until: verifiedUntil.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId)

                if (updateError) {
                    console.error('Error updating user subscription:', updateError)
                    throw updateError
                }
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
            const session = event.data.object

            if (session.metadata?.type === 'verification') {
                const userId = session.metadata.user_id

                // Set verified_until to 30 days from now
                const verifiedUntil = new Date()
                verifiedUntil.setDate(verifiedUntil.getDate() + 30)

                await supabase
                    .from('users')
                    .update({
                        is_verified: true,
                        verified_until: verifiedUntil.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId)

                // 2. Revalidate paths
                revalidatePath(`/profiles/${userId}`)
                revalidatePath('/freelancers') // If this exists
                revalidatePath('/settings') // Assuming a unified settings page
            }
            break

        case 'payment_intent.payment_failed':
            // Handle failed payment if needed
            break
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
}
