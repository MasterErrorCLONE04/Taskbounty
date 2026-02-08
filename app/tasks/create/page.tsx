import React from 'react'
import TaskForm from '@/components/tasks/TaskForm'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateTaskPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <nav className="p-6 border-b border-border/40 bg-card mb-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/client/dashboard" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al panel
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm">Creación Segura</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-black tracking-tight mb-4">
                        Publicar nueva tarea
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Completa los detalles de tu tarea. Recuerda que el monto será retenido en escrow para garantizar el pago al trabajador.
                    </p>
                </header>

                <TaskForm />
            </main>
        </div>
    )
}
