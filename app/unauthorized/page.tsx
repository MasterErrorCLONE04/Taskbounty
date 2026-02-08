import React from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-2xl text-center space-y-8">
                <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
                    <ShieldAlert className="w-12 h-12 text-destructive" />
                </div>

                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-3">Acceso Denegado</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        No tienes los permisos necesarios para acceder a esta sala de trabajo. Solo el cliente y el trabajador asignado pueden entrar aquí.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/tasks/explore"
                        className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al marketplace
                    </Link>
                    <Link
                        href="/"
                        className="w-full h-14 bg-muted text-muted-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
