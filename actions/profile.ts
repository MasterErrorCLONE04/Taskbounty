
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
