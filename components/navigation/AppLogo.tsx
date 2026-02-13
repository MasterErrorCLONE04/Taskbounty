
import Link from "next/link"
import { Check } from "lucide-react"

export function AppLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center bg-yellow-400 rounded-full shadow-sm border-2 border-yellow-500">
                <div className="absolute inset-0 rounded-full border border-white/30" />
                <Check className="w-5 h-5 text-green-700 stroke-[3]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">TaskBounty</span>
        </Link>
    )
}
