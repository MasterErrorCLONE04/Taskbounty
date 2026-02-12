'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

interface AuthModalContextType {
    openLogin: () => void;
    openSignup: () => void;
    closeModals: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    useEffect(() => {
        const login = searchParams.get('login');
        const signup = searchParams.get('signup');

        if (login === 'true') {
            setIsLoginOpen(true);
            setIsSignupOpen(false);
        } else if (signup === 'true') {
            setIsSignupOpen(true);
            setIsLoginOpen(false);
        }
    }, [searchParams]);

    const openLogin = () => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
    };

    const openSignup = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };

    const closeModals = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(false);

        // Clear search params if they were used to open the modal
        if (searchParams.get('login') || searchParams.get('signup')) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('login');
            params.delete('signup');
            const queryString = params.toString();
            router.replace(pathname + (queryString ? `?${queryString}` : ''), { scroll: false });
        }
    };

    return (
        <AuthModalContext.Provider value={{ openLogin, openSignup, closeModals }}>
            {children}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={closeModals}
                onSwitchToSignup={openSignup}
            />
            <SignupModal
                isOpen={isSignupOpen}
                onClose={closeModals}
                onSwitchToLogin={openLogin}
            />
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}
