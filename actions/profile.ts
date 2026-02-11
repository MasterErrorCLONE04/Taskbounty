
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile(userId: string) {
    const supabase = await createClient()

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return profile
}

export const getPublicProfile = getProfile

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const location = formData.get('location') as string
    const website = formData.get('website') as string

    // Parse skills from comma-separated string
    const skillsString = formData.get('skills') as string
    const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(Boolean) : []

    // Metadata updates for Auth User (if needed for session consistency)
    const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { name }
    })

    if (authUpdateError) {
        console.error('Error updating auth user metadata:', authUpdateError)
    }

    // Database updates for Public User Profile
    const updates: any = {
        name,
        bio,
        location,
        website,
        skills,
        summary: formData.get('summary') as string,
        portfolio: formData.get('portfolio') ? JSON.parse(formData.get('portfolio') as string) : [],
        certifications: formData.get('certifications') ? JSON.parse(formData.get('certifications') as string) : [],
        experience: formData.get('experience') ? JSON.parse(formData.get('experience') as string) : [],
        education: formData.get('education') ? JSON.parse(formData.get('education') as string) : [],
        updated_at: new Date().toISOString(),
    }

    // Handle Avatar Upload
    const avatarFile = formData.get('avatarFile') as File | null
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, { upsert: true })

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            updates.avatar_url = publicUrl
        }
    }

    // Handle Banner Upload
    const bannerFile = formData.get('bannerFile') as File | null
    if (bannerFile && bannerFile.size > 0) {
        const fileExt = bannerFile.name.split('.').pop()
        const filePath = `${user.id}/banner-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, bannerFile, { upsert: true })

        if (uploadError) {
            console.error('Error uploading banner:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            updates.banner_url = publicUrl
        }
    }

    // Handle JSON fields if passed (certifications, social_links would need more complex parsing from FormData if heavily used, 
    // but for now we might handle them separately or as JSON strings)
    // For MVP transparency, we'll stick to basic fields first or parse if sent as stringified JSON.

    const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        throw new Error(`Error updating profile: ${error.message}`)
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function getRightSidebarData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch Balance
    const { data: balance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // 2. Fetch Top Collaborators (Mock logic: Users with highest rating, excluding self)
    const { data: collaborators } = await supabase
        .from('users')
        .select('id, name, bio, avatar_url, rating')
        .neq('id', user.id)
        .order('rating', { ascending: false })
        .limit(3)

    const { data: suggestedBounties } = await supabase
        .from('tasks')
        .select('id, title, bounty_amount, category, currency')
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })
        .limit(3)

    // 4. Who to Follow (Randomized or popular users excluding self)
    const { data: whoToFollow } = await supabase
        .from('users')
        .select('id, name, avatar_url, email')
        .neq('id', user.id)
        .limit(3)

    return {
        balance: balance || { available_balance: 0, pending_balance: 0 },
        collaborators: collaborators || [],
        suggestedBounties: suggestedBounties || [],
        whoToFollow: whoToFollow || []
    }
}

export async function getUserBounties(userId: string) {
    const supabase = await createClient()

    const { data: bounties, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', userId)
        .neq('status', 'DRAFT')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user bounties:', error)
        return []
    }

    return bounties
}

export async function getUserReviews(userId: string) {
    const supabase = await createClient()

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
            *,
            reviewer:reviewer_id (
                id,
                name,
                avatar_url
            )
        `)
        .eq('target_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user reviews:', error)
        return []
    }

    return reviews
}

export async function searchUsers(query: string) {
    const supabase = await createClient()

    if (!query || query.length < 2) return []

    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, avatar_url, bio')
        .ilike('name', `%${query}%`)
        .limit(5)

    if (error) {
        console.error('Error searching users:', error)
        return []
    }

    return users
}
