'use client'

import React, { useState } from 'react'
import AuthModal from '@/components/auth/AuthModal'

interface LandingClientWrapperProps {
    topNavbar: React.ReactNode
    leftSidebar: React.ReactNode
    centerFeed: React.ReactNode
    rightSidebar: React.ReactNode
}

export default function LandingClientWrapper({
    topNavbar,
    leftSidebar,
    centerFeed,
    rightSidebar
}: LandingClientWrapperProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login')

    const openAuth = (view: 'login' | 'signup') => {
        setAuthModalView(view)
        setIsAuthModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* We need to pass openAuth to children. 
                Using React.cloneElement or wrapping them in a way they can access it.
                Alternatively, we can use a small context.
            */}

            {/* For now, let's just render and figure out the injection */}
            {React.isValidElement(topNavbar) && React.cloneElement(topNavbar as React.ReactElement<any>, { onOpenAuth: openAuth })}

            <div className="pt-20 max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <aside className="lg:col-span-3 hidden lg:block">
                        {leftSidebar}
                    </aside>

                    <main className="lg:col-span-6 space-y-4">
                        {centerFeed}
                    </main>

                    <aside className="lg:col-span-3 space-y-4 hidden lg:block">
                        {React.isValidElement(rightSidebar) && React.cloneElement(rightSidebar as React.ReactElement<any>, { onOpenAuth: openAuth })}
                        {/* If rightSidebar is a fragment or multiple items, cloning might be tricky. 
                            Let's assume it's a wrapper or we handle it inside.
                        */}
                    </aside>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onCloseAction={() => setIsAuthModalOpen(false)}
                initialView={authModalView}
            />
        </div>
    )
}
