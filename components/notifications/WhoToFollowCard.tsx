
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export function WhoToFollowCard() {
    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[1.1rem] font-bold text-slate-900">Who to follow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://ui-avatars.com/api/?name=Elena+G&background=random" className="w-9 h-9 rounded-full" alt="Elena" />
                        <div>
                            <p className="text-[13px] font-bold text-slate-900">Elena G.</p>
                            <p className="text-[11px] text-slate-500">@elenadev</p>
                        </div>
                    </div>
                    <Button size="sm" className="bg-slate-900 text-white rounded-full text-[11px] font-bold px-4 h-7">
                        Follow
                    </Button>
                </div>

                <Button variant="ghost" className="w-full text-blue-500 text-xs font-bold hover:text-blue-600 hover:bg-blue-50">
                    Show more
                </Button>
            </CardContent>
        </Card>
    )
}
