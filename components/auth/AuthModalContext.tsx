'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

interface AuthModalContextType {
    openLogin: (redirectUrl?: string) => void;
    openSignup: (redirectUrl?: string) => void;
    closeModals: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    console.log("AuthModalProvider rendering");
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);

    useEffect(() => {
        const login = searchParams.get('login');
        const signup = searchParams.get('signup');
        const redirect = searchParams.get('redirect');

        if (redirect) {
            setPostLoginRedirect(redirect);
        }

        if (login === 'true') {
            setIsLoginOpen(true);
            setIsSignupOpen(false);
        } else if (signup === 'true') {
            setIsSignupOpen(true);
            setIsLoginOpen(false);
        }
    }, [searchParams]);

    const openLogin = (redirectUrl?: string) => {
        if (redirectUrl && typeof redirectUrl === 'string') setPostLoginRedirect(redirectUrl);
        setIsSignupOpen(false);
        setIsLoginOpen(true);
    };

    const openSignup = (redirectUrl?: string) => {
        if (redirectUrl && typeof redirectUrl === 'string') setPostLoginRedirect(redirectUrl);
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };

    const closeModals = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(false);

        // Clear search params if they were used to open the modal
        if (searchParams.get('login') || searchParams.get('signup') || searchParams.get('redirect')) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('login');
            params.delete('signup');
            params.delete('redirect');
            const queryString = params.toString();
            router.replace(pathname + (queryString ? `?${queryString}` : ''), { scroll: false });
        }
    };

    const handleSuccess = () => {
        closeModals();
        if (postLoginRedirect) {
            router.push(postLoginRedirect);
            setPostLoginRedirect(null);
        } else {
            router.refresh();
        }
    };

    return (
        <AuthModalContext.Provider value={{ openLogin, openSignup, closeModals }}>
            {children}
            <LoginModal
                isOpen={isLoginOpen}
                onCloseAction={closeModals}
                onSwitchToSignupAction={openSignup}
                onSuccessAction={handleSuccess}
            />
            <SignupModal
                isOpen={isSignupOpen}
                onCloseAction={closeModals}
                onSwitchToLoginAction={openLogin}
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
