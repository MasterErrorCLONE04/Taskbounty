
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export function SuggestedBountiesCard() {
    const jobs = [
        { title: "Next.js 14 Migration", price: "$450", category: "Development" },
        { title: "SaaS Landing Page Design", price: "$1,200", category: "Design" },
        { title: "Penetration Test Report", price: "$3,000", category: "Security" },
    ]

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[1.1rem] font-bold text-slate-900">Suggested Bounties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.title} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide flex gap-1">
                            {job.category} <span className="text-slate-300">•</span> New
                        </p>
                        <h4 className="font-bold text-[13px] text-slate-900 leading-tight hover:text-blue-500 cursor-pointer transition-colors">
                            {job.title}
                        </h4>
                        <p className="font-bold text-blue-500 text-[13px]">{job.price} USDC</p>
                    </div>
                ))}

                <Button variant="ghost" className="w-full text-blue-500 text-xs font-bold hover:text-blue-600 hover:bg-blue-50">
                    Show more
                </Button>
            </CardContent>
        </Card>
    )
}
