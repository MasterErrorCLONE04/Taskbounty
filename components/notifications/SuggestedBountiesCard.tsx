import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from 'next/link'

interface SuggestedBountiesCardProps {
    bounties?: any[]
}

export function SuggestedBountiesCard({ bounties }: SuggestedBountiesCardProps) {
    const displayBounties = bounties || []

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[1.1rem] font-bold text-slate-900">Suggested Bounties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {displayBounties.length > 0 ? (
                    displayBounties.map((job) => (
                        <div key={job.id} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide flex gap-1">
                                {job.category || 'General'} <span className="text-slate-300">•</span> New
                            </p>
                            <Link href={`/tasks/${job.id}`}>
                                <h4 className="font-bold text-[13px] text-slate-900 leading-tight hover:text-blue-500 cursor-pointer transition-colors">
                                    {job.title}
                                </h4>
                            </Link>
                            <p className="font-bold text-blue-500 text-[13px]">${job.bounty_amount} {job.currency}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-slate-400 italic">No suggested bounties yet.</p>
                )}

                <Link href="/tasks" className="block">
                    <Button variant="ghost" className="w-full text-blue-500 text-xs font-bold hover:text-blue-600 hover:bg-blue-50">
                        Show more
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
