
import { ChevronDown } from "lucide-react"

export function JobsFilters() {
    return (
        <div className="px-6 flex flex-wrap gap-2 pb-6 border-b border-slate-50 bg-white">
            {['Price Range', 'Deadline', 'Experience Level', 'Escrow Guaranteed'].map((filter) => (
                <button
                    key={filter}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-100 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                    {filter} <ChevronDown size={14} />
                </button>
            ))}
        </div>
    )
}
