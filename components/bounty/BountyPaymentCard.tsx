import { Badge } from "@/components/ui/Badge"
import { Lock, Clock } from "lucide-react"

interface BountyPaymentCardProps {
    amount: number
    currency: string
    estimatedTime?: string
    isEscrow?: boolean
}

export function BountyPaymentCard({ amount, currency, estimatedTime, isEscrow = true }: BountyPaymentCardProps) {
    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mb-4">
            <div>
                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">
                    BOUNTY PAYMENT
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                    {amount} <span className="text-sm text-slate-500 font-bold">{currency}</span>
                </div>
                {estimatedTime && (
                    <div className="flex items-center gap-1.5 mt-2 text-slate-500 font-medium text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Est. {estimatedTime}</span>
                    </div>
                )}
            </div>
            {isEscrow && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold gap-1.5 py-1.5 pl-2 pr-3">
                    <Lock className="w-3 h-3" />
                    ESCROW ACTIVE
                </Badge>
            )}
        </div>
    )
}
