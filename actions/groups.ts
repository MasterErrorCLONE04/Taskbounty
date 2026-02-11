'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createGroup(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to create a group' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const avatar_url = formData.get('avatar_url') as string

    if (!name) {
        return { error: 'Group name is required' }
    }

    const { data, error } = await supabase
        .from('groups')
        .insert({
            name,
            description,
            avatar_url,
            created_by: user.id
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating group:', error)
        return { error: error.message }
    }

    revalidatePath('/groups')
    return { success: true, groupId: data.id }
}

export async function getGroups() {
    const supabase = await createClient()

    const { data: groups, error } = await supabase
        .from('groups')
        .select(`
            *,
            members:group_members(user_id)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching groups:', JSON.stringify(error, null, 2))
        return []
    }

    return groups.map(g => ({
        ...g,
        member_count: g.members.length
    }))
}

export async function getUserGroups() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: memberships, error } = await supabase
        .from('group_members')
        .select(`
            group:groups(*)
        `)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching user groups:', JSON.stringify(error, null, 2))
        return []
    }

    return memberships.map(m => m.group)
}

export async function joinGroup(groupId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to join a group' }
    }

    const { error } = await supabase
        .from('group_members')
        .insert({
            group_id: groupId,
            user_id: user.id
        })

    if (error) {
        console.error('Error joining group:', error)
        return { error: error.message }
    }

    revalidatePath(`/groups/${groupId}`)
    revalidatePath('/groups')
    return { success: true }
}

export async function leaveGroup(groupId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to leave a group' }
    }

    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error leaving group:', error)
        return { error: error.message }
    }

    revalidatePath(`/groups/${groupId}`)
    revalidatePath('/groups')
    return { success: true }
}

export async function checkMembership(groupId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('group_members')
        .select('user_id') // We just need to know if a row exists
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

    return !!data
}

