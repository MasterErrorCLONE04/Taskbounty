import * as React from "react"
import { LucideIcon } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'secondary'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    icon?: LucideIcon
    loading?: boolean
}

export function Button({
    children,
    className = "",
    variant = 'primary',
    size = 'md',
    icon: Icon,
    loading,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
        primary: "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600",
        outline: "border-2 border-slate-100 bg-transparent text-slate-600 hover:border-sky-200 hover:text-sky-500 hover:bg-sky-50",
        ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
        secondary: "bg-slate-900 text-white hover:bg-slate-800"
    }

    const sizes = {
        sm: "px-4 py-2 text-xs uppercase tracking-widest",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2.5"
    }

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
        <button className={combinedClassName} disabled={disabled || loading} {...props}>
            {loading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : Icon && <Icon className={`${children ? 'mr-2' : ''} h-5 w-5`} />}
            {children}
        </button>
    )
}
