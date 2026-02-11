'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

interface AuthModalContextType {
    openLogin: () => void;
    openSignup: () => void;
    closeModals: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

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
