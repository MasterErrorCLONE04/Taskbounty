
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function AppLogo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-200">
                <ShieldCheck size={22} className="text-white fill-white/20" />
            </div>
            {/* Optional: Add text logo if needed */}
        </Link>
    )
}
