'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { VALID_TRANSITIONS } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function createTaskWithEscrow(formData: {
    title: string
    description: string
    requirements: string
    bounty_amount: number
    deadline: string
    category: string
}) {
    try {
        const supabase = await createClient()

        // 1. Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
            throw new Error(`Auth Error: ${authError.message}`)
        }
        if (!user) {
            throw new Error('No hay una sesión activa. Por favor, inicia sesión de nuevo.')
        }

        // 1.1 Check if user exists in public.users
        const { data: publicUser, error: publicUserError } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', user.id)
            .single()

        if (publicUserError || !publicUser) {
            throw new Error('Error de perfil: No se encontró tu registro de usuario en la base de datos pública.')
        }

        // 2. Create task as DRAFT
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .insert({
                title: formData.title,
                description: formData.description,
                requirements: formData.requirements,
                bounty_amount: formData.bounty_amount,
                deadline: formData.deadline,
                client_id: user.id,
                category: formData.category,
                status: 'DRAFT'
            })
            .select()
            .single()

        if (taskError) {
            console.error('Task Insert Error:', taskError)
            throw taskError
        }

        // 3. Create PaymentIntent in Stripe
        let paymentIntent;
        try {
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(formData.bounty_amount * 100), // In cents
                currency: 'usd',
                metadata: {
                    task_id: task.id,
                    client_id: user.id
                },
                capture_method: 'automatic'
            })
        } catch (stripeErr: any) {
            console.error('Stripe Error:', stripeErr)
            throw new Error(`Error de Pago (Stripe): ${stripeErr.message}`)
        }

        // 4. Create payment record
        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                task_id: task.id,
                client_id: user.id,
                amount: formData.bounty_amount,
                status: 'PENDING',
                stripe_payment_intent_id: paymentIntent.id
            })

        if (paymentError) {
            console.error('Payment Insert Error:', paymentError)
            throw paymentError
        }

        revalidatePath('/client/dashboard')

        return {
            taskId: task.id,
            clientSecret: paymentIntent.client_secret
        }
    } catch (error: any) {
        console.error('createTaskWithEscrow failed:', error)
        throw error // Re-throw to be caught by the client component
    }
}

/**
 * Get the 4 most recent OPEN tasks for the landing page
 */
export async function getRecentOpenTasks() {
    try {
        const supabase = await createClient()

        const { data: tasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                client:users!client_id(name, avatar_url, bio)
            `)
            .eq('status', 'OPEN')
            .order('created_at', { ascending: false })
            .limit(4)

        if (error) {
            console.error('Supabase Error in getRecentOpenTasks:', error.message, error.details, error.hint)
            return []
        }

        return tasks || []
    } catch (err: any) {
        console.error('Unexpected Error in getRecentOpenTasks:', err)
        return []
    }
}
/**
 * Quick create a draft task from the dashboard feed
 */
/**
 * Quick create a draft task from the dashboard feed
 */
export async function createDraftTask(description: string, bounty_amount: number) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Must be logged in')

        // Create a basic draft
        const { data: task, error } = await supabase
            .from('tasks')
            .insert({
                client_id: user.id,
                title: 'New Bounty Request', // Default title, user can edit later
                description: description,
                requirements: 'To be defined', // Default to satisfy NOT NULL
                category: 'General', // Default to satisfy NOT NULL if applicable
                status: 'DRAFT',
                bounty_amount: bounty_amount,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 1 week
            })
            .select('id')
            .single()

        if (error) throw error

        return { success: true, taskId: task.id }
    } catch (error: any) {
        console.error('Create Draft Error:', error)
        return { success: false, error: error.message }
    }
}
