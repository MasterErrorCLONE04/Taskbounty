import * as React from "react"

interface AvatarProps {
    src?: string | null
    alt?: string
    fallback?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export function Avatar({
    src,
    alt = "User avatar",
    fallback = "U",
    size = 'md',
    className = ""
}: AvatarProps) {
    const sizes = {
        sm: "h-8 w-8 text-[10px]",
        md: "h-10 w-10 text-xs",
        lg: "h-12 w-12 text-sm",
        xl: "h-16 w-16 text-lg"
    }

    const baseStyles = "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 items-center justify-center font-black uppercase text-slate-400"

    return (
        <div className={`${baseStyles} ${sizes[size]} ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
            ) : (
                <span>{fallback.substring(0, 2)}</span>
            )}
        </div>
    )
}
