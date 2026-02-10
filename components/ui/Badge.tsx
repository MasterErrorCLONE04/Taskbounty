import * as React from "react"

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error' | 'outline'
    className?: string
}

export function Badge({
    children,
    variant = 'default',
    className = ""
}: BadgeProps) {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"

    const variants = {
        default: "bg-slate-100 text-slate-500",
        success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        warning: "bg-amber-50 text-amber-600 border border-amber-100",
        error: "bg-rose-50 text-rose-600 border border-rose-100",
        outline: "border border-slate-200 text-slate-500"
    }

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    )
}
