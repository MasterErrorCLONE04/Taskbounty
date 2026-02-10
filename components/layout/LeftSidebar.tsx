"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { UserProfileCard } from "@/components/sidebar/UserProfileCard"
import { SidebarNavigation } from "@/components/sidebar/SidebarNavigation"
import { JobsSidebarNav } from "@/components/jobs/JobsSidebarNav"

interface LeftSidebarProps {
    user?: any
}

export function LeftSidebar({ user }: LeftSidebarProps) {
    const pathname = usePathname()
    const isJobsPage = pathname === '/jobs'

    return (
        <aside className="hidden lg:flex flex-col w-64 h-full border-r border-transparent px-2 overflow-y-auto py-6 no-scrollbar">
            <div className="space-y-6 px-1">
                {user ? (
                    <UserProfileCard user={user} />
                ) : (
                    <div className="p-6 bg-slate-50 rounded-3xl mb-8 text-center">
                        <p className="text-sm font-bold text-slate-500 leading-relaxed mb-4">
                            Join TaskBounty to post tasks and earn USDC.
                        </p>
                        <Button className="w-full" size="sm">
                            Join Now
                        </Button>
                    </div>
                )}

                {isJobsPage ? <JobsSidebarNav /> : <SidebarNavigation />}
            </div>
        </aside>
    )
}
