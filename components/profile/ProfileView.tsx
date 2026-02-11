"use client"

import { useState, useEffect } from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileInfo } from '@/components/profile/ProfileInfo'
import { ProfileTabs } from '@/components/profile/ProfileTabs'

import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { createBrowserClient } from '@supabase/ssr'

import { PortfolioGrid } from '@/components/profile/PortfolioGrid'
import { AboutTab } from '@/components/profile/AboutTab'
import { BountiesTab } from '@/components/profile/BountiesTab'
import { ReviewsTab } from '@/components/profile/ReviewsTab'

interface ProfileViewProps {
    initialUser?: any
}

export function ProfileView({ initialUser }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState('Bounties')
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [user, setUser] = useState<any>(initialUser || null)
    const [loading, setLoading] = useState(!initialUser)

    // Determine if we are viewing our own profile
    // If initialUser is provided, we compare it with the auth user (fetched below)
    // If not provided, we assume we are loading our own profile
    const [isOwnProfile, setIsOwnProfile] = useState(!initialUser)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        async function fetchData() {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            // If we have an initialUser (public view), check if it's us
            if (initialUser && authUser) {
                setIsOwnProfile(initialUser.id === authUser.id)
                return // We already have the user data
            }

            // If no initialUser, fetch our own profile
            if (authUser && !initialUser) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                if (profile) {
                    setUser(profile)
                    setIsOwnProfile(true)
                } else {
                    // Fallback if profile doesn't exist yet
                    setUser({
                        ...authUser,
                        name: authUser.user_metadata?.name || 'User'
                    })
                    setIsOwnProfile(true)
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [initialUser])

    if (loading) return <div className="p-10 text-center">Loading profile...</div>

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <ProfileHeader
                user={user}
                isOwnProfile={isOwnProfile}
                onEditAction={() => setIsEditOpen(true)}
            />
            <ProfileInfo user={user} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="bg-slate-50/50 min-h-[400px]">
                {activeTab === 'Portfolio' && (
                    <div>
                        {isOwnProfile && (
                            <div className="px-6 pt-6 flex justify-end">
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-full text-sm shadow-md hover:bg-slate-800 transition-colors"
                                >
                                    + Add Project
                                </button>
                            </div>
                        )}
                        <PortfolioGrid
                            items={user?.portfolio || []}
                            onAdd={isOwnProfile ? () => setIsEditOpen(true) : undefined}
                        />
                    </div>
                )}

                {activeTab === 'About' && (
                    <AboutTab user={user} />
                )}

                {activeTab === 'Bounties' && (
                    <BountiesTab userId={user.id} />
                )}

                {activeTab === 'Reviews' && (
                    <ReviewsTab userId={user.id} />
                )}
            </div>

            {isEditOpen && (
                <EditProfileModal
                    user={user}
                    isOpen={isEditOpen}
                    onClose={() => {
                        setIsEditOpen(false)
                        window.location.reload()
                    }}
                />
            )}
        </div>
    )
}
