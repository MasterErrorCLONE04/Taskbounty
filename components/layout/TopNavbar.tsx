"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { LoginModal } from "@/components/auth/LoginModal"
import { SignupModal } from "@/components/auth/SignupModal"

import { AppLogo } from "@/components/navigation/AppLogo"
import { GlobalSearchInput } from "@/components/navigation/GlobalSearchInput"
import { PrimaryNavMenu } from "@/components/navigation/PrimaryNavMenu"
import { UserMenuDropdown } from "@/components/navigation/UserMenuDropdown"

interface TopNavbarProps {
    user?: any
    profile?: any
}

export function TopNavbar({ user, profile }: TopNavbarProps) {
    const [isLoginOpen, setIsLoginOpen] = React.useState(false)
    const [isSignupOpen, setIsSignupOpen] = React.useState(false)

    // Prioritize DB profile, fallback to Auth user
    const displayUser = profile || user;

    return (
        <>
            <header className="z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex-none">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

                    {/* Logo & Search */}
                    <div className="flex items-center gap-4 flex-1">
                        <AppLogo />
                        <GlobalSearchInput />
                    </div>

                    {/* Navigation & Profile */}
                    <div className="flex items-center h-full">
                        {displayUser ? (
                            <>
                                <PrimaryNavMenu />
                                <UserMenuDropdown user={displayUser} />
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="rounded-full px-4 h-9 font-bold text-sm" onClick={() => setIsLoginOpen(true)}>
                                    Log in
                                </Button>
                                <Button className="rounded-full px-4 h-9 font-bold text-sm" onClick={() => setIsSignupOpen(true)}>
                                    Sign up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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
        </>
    )
}
