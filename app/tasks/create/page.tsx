
import React from 'react'
import TaskForm from '@/components/tasks/TaskForm'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { redirect } from 'next/navigation'

export default async function CreateTaskPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    const profile = await getProfile(user.id)

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 flex justify-center overflow-hidden">
                {/* Left Sidebar - Navigation */}
                <LeftSidebar user={profile || user} />

                <main className="flex-1 max-w-4xl mx-auto px-6 overflow-y-auto pb-20 pt-8 no-scrollbar border-x border-slate-50">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-black tracking-tight mb-4">
                            Post a New Bounty
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Complete your task details. The bounty amount will be held in escrow to guarantee payment.
                        </p>
                    </header>

                    <TaskForm />
                </main>

                {/* Right Sidebar - Widgets */}
                <RightSidebar user={profile || user} />
            </div>
        </div>
    )
}
