
import { Search } from "lucide-react"

export function GlobalSearchInput() {
    return (
        <div className="relative w-full max-w-xs group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
                type="text"
                placeholder="Search TaskBounty"
                className="w-full bg-slate-100 border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-500 outline-none"
            />
        </div>
    )
}
