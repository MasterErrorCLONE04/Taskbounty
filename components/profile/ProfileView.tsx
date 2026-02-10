"use client"

import { useState, useEffect } from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileInfo } from '@/components/profile/ProfileInfo'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileFeed } from '@/components/profile/ProfileFeed'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { createBrowserClient } from '@supabase/ssr'

export function ProfileView() {
    const [activeTab, setActiveTab] = useState('Bounties')
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        async function fetchData() {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                if (profile) {
                    setUser(profile)
                } else {
                    // Fallback if profile doesn't exist yet (should exist via trigger, but just in case)
                    setUser({
                        ...authUser,
                        name: authUser.user_metadata?.name || 'User'
                    })
                }
            }
            setLoading(false)
        }
        fetchData()
    }, []) // Simplistic fetch on mount

    if (loading) return <div className="p-10 text-center">Loading profile...</div>

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <ProfileHeader user={user} onEdit={() => setIsEditOpen(true)} />
            <ProfileInfo user={user} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <ProfileFeed />

            <EditProfileModal
                user={user}
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false)
                    // Re-fetch or simplistic page reload to see changes
                    window.location.reload()
                }}
            />
        </div>
    )
}
