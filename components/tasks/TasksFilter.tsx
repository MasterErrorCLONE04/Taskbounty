
import { Search } from "lucide-react"

export function TasksFilter() {
    return (
        <div className="px-4 pb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Filter tasks by name or hunter..."
                    className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                />
            </div>
        </div>
    )
}
