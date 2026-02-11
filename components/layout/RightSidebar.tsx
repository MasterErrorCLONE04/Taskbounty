"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Card, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

import { LoginModal } from "@/components/auth/LoginModal"
import { SignupModal } from "@/components/auth/SignupModal"

import { TopEarnersCard } from "@/components/finance/TopEarnersCard"
import { TrendingSkillsCard } from "@/components/trending/TrendingSkillsCard"
import { AppFooter } from "@/components/footer/AppFooter"
import { AccountOverviewCard } from "@/components/profile/AccountOverviewCard"
import { QuickStatsCard } from "@/components/stats/QuickStatsCard"
import { SuggestedBountiesCard } from "@/components/notifications/SuggestedBountiesCard"
import { WhoToFollowCard } from "@/components/notifications/WhoToFollowCard"
import { VerifiedSkillsCard } from "@/components/profile/VerifiedSkillsCard"
import { CertificationsCard } from "@/components/profile/CertificationsCard"
import { TopCollaboratorsCard } from "@/components/profile/TopCollaboratorsCard"

interface RightSidebarProps {
    user?: any
    balance?: any
    collaborators?: any[]
    suggestedBounties?: any[]
    whoToFollow?: any[]
}

export function RightSidebar({ user, balance, collaborators, suggestedBounties, whoToFollow }: RightSidebarProps) {
    const pathname = usePathname()
    const isTasksPage = pathname === '/tasks'
    const isNotificationsPage = pathname === '/notifications'
    const isProfilePage = pathname === '/profile'

    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isSignupOpen, setIsSignupOpen] = useState(false)

    return (
        <aside className="hidden lg:flex flex-col w-80 h-full border-l border-transparent px-4 overflow-y-auto py-6 no-scrollbar">
            <div className="space-y-4">

                {/* Auth Modals */}
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={() => setIsLoginOpen(false)}
                    onSwitchToSignup={() => {
                        setIsLoginOpen(false)
                        setIsSignupOpen(true)
                    }}
                />

                <SignupModal
                    isOpen={isSignupOpen}
                    onClose={() => setIsSignupOpen(false)}
                    onSwitchToLogin={() => {
                        setIsSignupOpen(false)
                        setIsLoginOpen(true)
                    }}
                />

                {user ? (
                    <>
                        {isProfilePage && <AccountOverviewCard balance={balance} />}

                        {isTasksPage ? (
                            <QuickStatsCard />
                        ) : isNotificationsPage ? (
                            <>
                                <SuggestedBountiesCard bounties={suggestedBounties} />
                                <WhoToFollowCard users={whoToFollow} />
                            </>
                        ) : isProfilePage ? (
                            <>
                                <VerifiedSkillsCard skills={user?.skills} />
                                <CertificationsCard certifications={user?.certifications} />
                                <TopCollaboratorsCard collaborators={collaborators} />
                            </>
                        ) : (
                            <>
                                <AccountOverviewCard balance={balance} />
                                <SuggestedBountiesCard bounties={suggestedBounties} />
                                <TopEarnersCard />
                                <TrendingSkillsCard />
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {/* Guest Signup Widget */}
                        <Card className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <CardTitle className="mb-3 text-[1.25rem] font-black tracking-tight text-slate-900">New to TaskBounty?</CardTitle>
                            <p className="text-[13px] text-slate-500 font-normal mb-5 leading-snug">
                                Sign up now to get your own personalized timeline!
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => setIsSignupOpen(true)}
                                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px] shadow-sm transition-transform active:scale-95"
                                >
                                    <div className="bg-white rounded-full p-0.5">
                                        <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="Google" />
                                    </div>
                                    Sign up with Google
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSignupOpen(true)}
                                    className="w-full h-10 bg-white hover:bg-slate-50 text-slate-900 rounded-full flex items-center justify-center gap-2 font-bold text-[14px] border border-slate-200 shadow-sm transition-transform active:scale-95"
                                >
                                    <img src="https://www.apple.com/favicon.ico" className="w-4 h-4" alt="Apple" />
                                    Sign up with Apple
                                </Button>

                                <Button
                                    onClick={() => setIsSignupOpen(true)}
                                    className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold text-[15px] shadow-none border-none transition-transform active:scale-95"
                                >
                                    Create account
                                </Button>
                            </div>
                        </Card>

                        <TopEarnersCard />
                        <TrendingSkillsCard />
                    </>
                )}

                <AppFooter />
            </div>
        </aside>
    )
}
