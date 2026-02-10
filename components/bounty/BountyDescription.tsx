interface BountyDescriptionProps {
    description: string
    title?: string // Adding title support if needed, though usually part of description in this feed style
}

export function BountyDescription({ description }: BountyDescriptionProps) {
    return (
        <div className="text-[15px] text-slate-900 leading-relaxed mb-4 whitespace-pre-wrap">
            {description}
        </div>
    )
}
