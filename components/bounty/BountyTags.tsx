interface BountyTagsProps {
    tags: string[]
}

export function BountyTags({ tags }: BountyTagsProps) {
    if (!tags || tags.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
                <span key={tag} className="text-[13px] font-medium text-sky-500 hover:underline cursor-pointer">
                    #{tag}
                </span>
            ))}
        </div>
    )
}
