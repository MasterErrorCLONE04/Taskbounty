import Link from "next/link"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import { VerifiedBadge } from "@/components/ui/VerifiedBadge"

interface PremiumPromoProps {
    isPremium?: boolean
}

export function PremiumPromo({ isPremium = false }: PremiumPromoProps) {
    if (isPremium) {
        return (
            <div className="mx-6 mb-6 relative overflow-hidden rounded-[1.5rem] bg-slate-900 p-6 text-center shadow-lg shadow-blue-900/10 group cursor-default">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100%] transition-transform group-hover:scale-110 duration-700"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5 mb-4 shadow-lg shadow-blue-500/30">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <VerifiedBadge className="w-6 h-6" />
                        </div>
                    </div>

                    <h3 className="text-white font-black text-lg mb-1 tracking-tight">Premium Member</h3>
                    <p className="text-slate-400 text-xs font-medium mb-5 max-w-[200px] leading-relaxed">
                        You have access to all exclusive features and tools.
                    </p>

                    <Link href="/premium" className="w-full">
                        <div className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-bold py-3 rounded-xl transition-all active:scale-95 text-[13px] flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} className="text-blue-400" />
                            <span>Active Plan</span>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-6 mb-6 relative overflow-hidden rounded-[1.5rem] bg-slate-900 p-6 text-center shadow-xl shadow-blue-900/10 group border border-slate-800">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-[100%] rounded-tr-[1.5rem] transition-transform group-hover:scale-110 duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-5 border border-slate-700 shadow-inner group-hover:border-blue-500/50 transition-colors">
                    <VerifiedBadge className="w-7 h-7 drop-shadow-md" />
                </div>

                <h3 className="text-white font-black text-xl mb-2 tracking-tight">Get Verified</h3>
                <p className="text-slate-400 text-sm font-medium mb-5 leading-relaxed">
                    Stand out with the blue badge, lower platform fees, and priority support.
                </p>

                <Link href="/premium">
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all active:scale-95 text-sm flex items-center justify-center gap-2">
                        <span>Get Premium</span>
                        <ShieldCheck size={16} />
                    </button>
                </Link>
            </div>
        </div>
    )
}
