
import { ChevronDown } from "lucide-react"

interface JobsFiltersProps {
    activeCategory: string
    onCategoryChange: (category: string) => void
}

export function JobsFilters({ activeCategory, onCategoryChange }: JobsFiltersProps) {
    const categories = ['All', 'Diseño', 'Código', 'Content', 'Video', 'General']

    return (
        <div className="px-6 flex flex-wrap gap-2 pb-6 border-b border-slate-50 bg-white">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all text-[13px] font-medium ${activeCategory === cat
                            ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                            : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    {cat} {cat === 'All' ? <ChevronDown size={14} /> : null}
                </button>
            ))}
        </div>
    )
}
