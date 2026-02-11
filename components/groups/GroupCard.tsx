import Link from 'next/link'
import { Users } from 'lucide-react'

interface GroupCardProps {
    group: any
}

export function GroupCard({ group }: GroupCardProps) {
    // Handle the count from Supabase relation
    const memberCount = group.member_count || 0

    return (
        <Link
            href={`/groups/${group.id}`}
            className="block group bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all duration-300"
        >
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 overflow-hidden border border-indigo-100 group-hover:scale-105 transition-transform">
                    {group.avatar_url ? (
                        <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                    ) : (
                        <Users size={32} />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {group.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1 mb-3 h-10">
                        {group.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-colors">
                            {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        <span>Active recently</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
