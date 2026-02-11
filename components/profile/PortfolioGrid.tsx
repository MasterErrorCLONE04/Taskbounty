"use client"

import { ExternalLink, Image as ImageIcon } from 'lucide-react'

interface PortfolioItem {
    title: string
    description: string
    link: string
    image_url?: string
}

interface PortfolioGridProps {
    items: PortfolioItem[]
    onAdd?: () => void
}

export function PortfolioGrid({ items, onAdd }: PortfolioGridProps) {
    if (!items || items.length === 0) {
        return (
            <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 m-6 flex flex-col items-center justify-center">
                <ImageIcon className="mx-auto mb-3 opacity-50" size={48} />
                <p className="font-medium mb-4">No projects added to portfolio yet.</p>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
                    >
                        + Add First Project
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pb-20">
            {items.map((item, index) => (
                <div key={index} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                <ImageIcon size={48} />
                            </div>
                        )}
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                            {item.description}
                        </p>
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] font-bold text-blue-500 hover:text-blue-600 inline-flex items-center gap-1.5 mt-auto"
                            >
                                View Project <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
