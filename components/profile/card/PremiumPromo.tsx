import Link from "next/link"
import { CheckCircle2, Star } from "lucide-react"

interface PremiumPromoProps {
    isPremium?: boolean
}

export function PremiumPromo({ isPremium = false }: PremiumPromoProps) {
    if (isPremium) {
        return (
            <div className="mx-6 mb-6 relative overflow-hidden rounded-[2.5rem] bg-[#FDE6A6] p-8 text-left group cursor-default">
                <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-[#F0D481] opacity-50 rotate-12" />

                <div className="relative z-10">
                    <h3 className="text-[#2D2611] font-black text-3xl mb-3 leading-tight max-w-[200px]">
                        Premium Member
                    </h3>
                    <p className="text-[#5C502D] text-lg font-medium mb-8 leading-snug max-w-[240px]">
                        You have access to all exclusive features and tools.
                    </p>

                    <Link href="/premium">
                        <div className="inline-flex w-fit items-center gap-3 bg-[#1C190D] hover:bg-black text-[#FDE6A6] px-6 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm transition-all active:scale-95 whitespace-nowrap shadow-md">
                            <CheckCircle2 size={18} className="shrink-0" />
                            <span>Active Plan</span>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-6 mb-6 relative overflow-hidden rounded-[2.5rem] bg-[#FDE6A6] p-8 text-left group border border-[#F0D481]/50">
            {/* Icono de estrella decorativo similar al de la imagen */}
            <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-[#F0D481] opacity-50 rotate-12 transition-transform group-hover:scale-110 duration-700" />

            <div className="relative z-10">
                <h3 className="text-[#2D2611] font-black text-3xl mb-3 leading-tight max-w-[200px]">
                    Upgrade to Premium
                </h3>
                <p className="text-[#5C502D] text-lg font-medium mb-8 leading-snug max-w-[240px]">
                    Access higher-tier bounties and priority support.
                </p>

                <Link href="/premium">
                    <button className="w-fit whitespace-nowrap bg-[#1C190D] hover:bg-black text-[#FDE6A6] px-8 py-3.5 rounded-full font-extrabold uppercase tracking-wider text-sm transition-all active:scale-95 shadow-lg shadow-black/10">
                        Learn More
                    </button>
                </Link>
            </div>
        </div>
    )
}