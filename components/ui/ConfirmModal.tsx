'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Trash2, LogOut, ShieldAlert, X, Loader2 } from 'lucide-react'

type ConfirmVariant = 'danger' | 'warning' | 'info'

interface ConfirmModalProps {
    isOpen: boolean
    onCloseAction: () => void
    onConfirmAction: () => void | Promise<void>
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: ConfirmVariant
    isLoading?: boolean
}

const variantConfig = {
    danger: {
        icon: Trash2,
        iconBg: 'bg-red-50',
        iconColor: 'text-red-500',
        btnClass: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm shadow-red-200',
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        btnClass: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm shadow-amber-200',
    },
    info: {
        icon: ShieldAlert,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        btnClass: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm shadow-blue-200',
    },
}

export function ConfirmModal({
    isOpen,
    onCloseAction,
    onConfirmAction,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    const [mounted, setMounted] = React.useState(false)
    const [localLoading, setLocalLoading] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
            setLocalLoading(false)
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // ESC key to close
    React.useEffect(() => {
        if (!isOpen) return
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !localLoading && !isLoading) onCloseAction()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, localLoading, isLoading, onCloseAction])

    if (!mounted || !isOpen) return null

    const config = variantConfig[variant]
    const Icon = config.icon
    const loading = isLoading || localLoading

    const handleConfirm = async () => {
        try {
            setLocalLoading(true)
            await onConfirmAction()
        } catch {
            setLocalLoading(false)
        }
    }

    const content = (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
                onClick={() => !loading && onCloseAction()}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-[380px] bg-white rounded-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onCloseAction}
                    disabled={loading}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10 disabled:opacity-50"
                >
                    <X size={16} />
                </button>

                {/* Body */}
                <div className="p-6 pt-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
                        <Icon size={22} className={config.iconColor} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onCloseAction}
                        disabled={loading}
                        className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 h-10 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${config.btnClass}`}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}
