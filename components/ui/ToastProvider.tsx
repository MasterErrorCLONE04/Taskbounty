'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => { } })

export const useToast = () => useContext(ToastContext)

const iconMap = {
    success: { icon: CheckCircle2, bg: 'bg-green-50 border-green-100', text: 'text-green-600', iconColor: 'text-green-500' },
    error: { icon: XCircle, bg: 'bg-red-50 border-red-100', text: 'text-red-600', iconColor: 'text-red-500' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', iconColor: 'text-amber-500' },
    info: { icon: Info, bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', iconColor: 'text-blue-500' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [mounted, setMounted] = useState(false)

    React.useEffect(() => setMounted(true), [])

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            {mounted && createPortal(
                <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none max-w-[360px]">
                    {toasts.map((t) => {
                        const cfg = iconMap[t.type]
                        const Icon = cfg.icon
                        return (
                            <div
                                key={t.id}
                                className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${cfg.bg} animate-[fadeIn_0.2s_ease-out]`}
                            >
                                <Icon size={18} className={`${cfg.iconColor} flex-shrink-0 mt-0.5`} />
                                <p className={`text-sm font-medium ${cfg.text} flex-1 leading-relaxed`}>{t.message}</p>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="p-0.5 text-slate-400 hover:text-slate-600 flex-shrink-0"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )
                    })}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}
