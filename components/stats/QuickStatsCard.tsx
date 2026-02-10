
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function QuickStatsCard() {
    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[1.1rem] font-bold text-slate-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Success Rate</span>
                    <span className="text-sm font-bold text-slate-900">100%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Avg. Rating</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        4.9 <span className="text-slate-900 text-[10px]">★</span>
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Active Bounties</span>
                    <span className="text-sm font-bold text-slate-900">3</span>
                </div>

                <div className="pt-4 border-t border-slate-50 flex gap-3 text-[11px] text-slate-400">
                    <a href="#" className="hover:underline hover:text-slate-500">Terms of Service</a>
                    <a href="#" className="hover:underline hover:text-slate-500">Privacy Policy</a>
                </div>
                <p className="text-[11px] text-slate-300">© 2024 TaskBounty Corp.</p>
            </CardContent>
        </Card>
    )
}
