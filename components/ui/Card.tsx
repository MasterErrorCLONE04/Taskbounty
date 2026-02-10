import * as React from "react"

interface CardProps {
    children: React.ReactNode
    className?: string
    noPadding?: boolean
}

export function Card({
    children,
    className = "",
    noPadding = false
}: CardProps) {
    return (
        <div className={`bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow overflow-hidden ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}>
            {children}
        </div>
    )
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <h3 className={`text-lg font-black text-slate-900 tracking-tight ${className}`}>{children}</h3>
}

export function CardContent({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`${className}`}>{children}</div>
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`mt-6 pt-6 border-t border-slate-50 ${className}`}>{children}</div>
}
