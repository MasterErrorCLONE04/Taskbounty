import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

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
            const taskId = paymentIntent.metadata.task_id
            const clientId = paymentIntent.metadata.client_id

            // 1. Payment is captured automatically (capture_method: automatic)
            // No need to call stripe.paymentIntents.capture(paymentIntent.id) here

            // 2. Update payment status to HELD
            await supabase
                .from('payments')
                .update({ status: 'HELD', updated_at: new Date().toISOString() })
                .eq('stripe_payment_intent_id', paymentIntent.id)

            // 3. Update task status to OPEN
            await supabase
                .from('tasks')
                .update({ status: 'OPEN', updated_at: new Date().toISOString() })
                .eq('id', taskId)

            // 4. Log the state change
            await supabase
                .from('state_logs')
                .insert({
                    entity_type: 'task',
                    entity_id: taskId,
                    old_state: 'DRAFT',
                    new_state: 'OPEN',
                    user_id: clientId,
                    metadata: { stripe_payment_intent_id: paymentIntent.id }
                })

            break

        case 'payment_intent.payment_failed':
            // Handle failed payment if needed
            break
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
}
