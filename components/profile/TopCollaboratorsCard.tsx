
import { Avatar } from "@/components/ui/Avatar"

interface TopCollaboratorsCardProps {
    collaborators?: any[]
}

export function TopCollaboratorsCard({ collaborators }: TopCollaboratorsCardProps) {
    const displayList = collaborators || []

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-5 tracking-tight">Top Collaborators</h3>

            {displayList.length > 0 ? (
                <div className="space-y-4">
                    {displayList.map((collab) => (
                        <div key={collab.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={collab.avatar_url}
                                    fallback={collab.name?.[0] || 'U'}
                                    className="w-10 h-10 rounded-full shadow-sm"
                                />
                                <div>
                                    <p className="text-[14px] font-black text-slate-900 truncate max-w-[100px]">{collab.name}</p>
                                    <p className="text-[12px] text-slate-400 font-medium truncate max-w-[100px]">{collab.bio || 'TaskBounty User'}</p>
                                </div>
                            </div>
                            <button className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[12px] font-bold hover:bg-slate-800 transition-all">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-400 italic">No active collaborators found.</p>
            )}

            <button className="text-blue-500 font-bold text-[13px] mt-6 block hover:underline">
                Show more
            </button>
        </div>
    )
}
