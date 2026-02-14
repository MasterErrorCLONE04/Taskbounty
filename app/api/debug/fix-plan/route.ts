import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
        }

        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!serviceRoleKey) {
            return NextResponse.json({ error: 'CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local' }, { status: 500 })
        }

        const admin = createAdminClient()

        // Try to update the user to premium_plus
        const { error } = await admin
            .from('users')
            .update({
                plan: 'premium_plus',
                is_verified: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            return NextResponse.json({ error: `Supabase Update Error: ${error.message}` }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Plan updated to premium_plus successfully.',
            user_id: user.id
        })
    } catch (err: any) {
        return NextResponse.json({ error: `Server Error: ${err.message}` }, { status: 500 })
    }
}
