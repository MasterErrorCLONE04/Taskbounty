
import { Bookmark, Clock, CheckCircle2 } from 'lucide-react'

export interface JobBounty {
    id: string
    title: string
    author: string
    role: string
    rating: number
    description: string
    tags: string[]
    amount: number
    currency: string
    timeEst: string
    avatar: string
}

interface JobCardProps {
    job: JobBounty
}

export function JobCard({ job }: JobCardProps) {
    return (
        <div className="p-6 border-b border-slate-50 hover:bg-slate-50/30 transition-all relative group cursor-pointer bg-white">
            <div className="flex gap-4">
                <img src={job.avatar} alt={job.author} className="w-12 h-12 rounded-full shadow-sm object-cover" />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-500 transition-colors">
                                {job.title}
                            </h2>
                            <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                                <span className="font-semibold text-slate-700">{job.author}</span>
                                <span>•</span>
                                <span>{job.role}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 font-bold text-orange-500">
                                    {job.rating}★
                                </span>
                            </div>
                        </div>
                        <button className="text-slate-400 hover:text-blue-500 transition-all p-1">
                            <Bookmark size={20} />
                        </button>
                    </div>

                    <p className="mt-3 text-[14px] text-slate-600 leading-relaxed max-w-xl">
                        {job.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                            <span key={tag} className="text-blue-500 font-bold text-[13px] hover:underline cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <p className="text-2xl font-black text-slate-900 leading-none">
                                    ${job.amount} <span className="text-[14px] text-slate-500 uppercase font-bold">{job.currency}</span>
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
                                        <Clock size={14} />
                                        {job.timeEst}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600 tracking-tighter">
                                        <CheckCircle2 size={12} />
                                        ESCROW ACTIVE
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-black px-8 py-2.5 rounded-full text-[14px] shadow-sm transition-all transform active:scale-95">
                            Easy Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
