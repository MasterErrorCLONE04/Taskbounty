'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '@/actions/auth'

interface LogOutButtonProps {
    variant?: 'default' | 'minimal'
}

export default function LogOutButton({ variant = 'default' }: LogOutButtonProps) {
    if (variant === 'minimal') {
        return (
            <form action={signOut} className="w-full">
                <button
                    type="submit"
                    className="flex items-center gap-4 w-full text-slate-400 hover:text-rose-500 transition-colors font-bold text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar sesión
                </button>
            </form>
        )
    }

    return (
        <form action={signOut}>
            <button
                type="submit"
                className="flex items-center gap-2 text-muted-foreground hover:text-destructive font-bold text-sm transition-colors px-4 py-2 rounded-xl hover:bg-destructive/5"
            >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
            </button>
        </form>
    )
}
