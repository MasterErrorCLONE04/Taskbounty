"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { UserProfileCard } from "@/components/sidebar/UserProfileCard"
import { SidebarNavigation } from "@/components/sidebar/SidebarNavigation"
import { JobsSidebarNav } from "@/components/jobs/JobsSidebarNav"
import { ProfileCard } from "@/components/profile/ProfileCard"

interface LeftSidebarProps {
    user?: any
    sidebarData?: any
}

export function LeftSidebar({ user, sidebarData }: LeftSidebarProps) {
    const pathname = usePathname()
    const isJobsPage = pathname === '/jobs'

    return (
        <aside className="hidden lg:flex flex-col w-80 h-full border-r border-transparent px-4 py-6 overflow-y-auto no-scrollbar">
            <div className="space-y-6">
                {user ? (
                    isJobsPage ? (
                        <>
                            <UserProfileCard user={user} />
                            <JobsSidebarNav />
                        </>
                    ) : (
                        <ProfileCard
                            user={user}
                            stats={{
                                reputation: user.reputation || 0,
                                earnings: sidebarData?.balance?.total || 0,
                                views: user.views || 0,
                                followers: sidebarData?.followersCount || 0,
                                following: sidebarData?.followingCount || 0
                            }}
                        />
                    )
                ) : (
                    <>
                        <div className="p-6 bg-slate-50 rounded-3xl mb-8 text-center">
                            <p className="text-sm font-bold text-slate-500 leading-relaxed mb-4">
                                Join TaskBounty to post tasks and earn USDC.
                            </p>
                            <Button className="w-full" size="sm">
                                Join Now
                            </Button>
                        </div>
                        {isJobsPage ? <JobsSidebarNav /> : <SidebarNavigation />}
                    </>
                )}
            </div>
        </aside>
    )
}
