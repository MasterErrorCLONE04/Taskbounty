
import { Search } from "lucide-react"

interface JobsSearchProps {
    value: string
    onChange: (val: string) => void
}

export function JobsSearch({ value, onChange }: JobsSearchProps) {
    return (
        <div className="px-6 pb-4 bg-white">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={20} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Job titles, keywords, or skills"
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                />
            </div>
        </div>
    )
}
