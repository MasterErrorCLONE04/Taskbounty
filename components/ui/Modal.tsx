import * as React from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    desktopOnly?: boolean
    title?: string
}

export function Modal({ isOpen, onClose, children, desktopOnly = false, title }: ModalProps) {
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!isMounted) return null

    if (!isOpen) return null

    const content = (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative z-50 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 p-0 overflow-hidden ${desktopOnly ? 'hidden md:block' : ''}`}>
                <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-900" />
                    </button>
                    {title && (
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <img src="/logo-small.png" alt="TaskBounty" className="h-6 w-6" /> {/* Placeholder/Logo if needed, or title text */}
                        </div>
                    )}
                    <div className="w-9" /> {/* Spacer for centering */}
                </div>

                <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}
