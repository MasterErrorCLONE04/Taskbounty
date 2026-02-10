import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface BountyCTAProps {
    status?: 'open' | 'closed' | 'completed'
    priority?: boolean
    isEasyApply?: boolean
}

export function BountyCTA({ status = 'open', priority, isEasyApply = true }: BountyCTAProps) {
    const isClosed = status !== 'open'

    return (
        <div className="flex justify-end gap-2">
            {priority && (
                <Badge variant="outline" className="border-rose-100 text-rose-600 bg-rose-50 font-bold">
                    High Priority
                </Badge>
            )}

            {isEasyApply ? (
                <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold px-6" disabled={isClosed}>
                    {isClosed ? 'Closed' : 'Easy Apply'}
                </Button>
            ) : (
                <Button className="rounded-full font-bold px-6" disabled={isClosed}>
                    {isClosed ? 'Closed' : 'Apply'}
                </Button>
            )}
        </div>
    )
}
