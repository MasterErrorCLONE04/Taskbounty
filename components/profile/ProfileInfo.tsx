
import { BadgeCheck, MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
import { VerifiedBadge } from "@/components/ui/VerifiedBadge"
import { format } from 'date-fns'

interface ProfileInfoProps {
    user: any
}

export function ProfileInfo({ user }: ProfileInfoProps) {
    return (
        <div className="px-6">
            <div className="flex items-center gap-1.5">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                {user?.is_verified && (
                    <VerifiedBadge className="w-6 h-6 ml-1" />
                )}
            </div>
            <p className="text-[15px] text-slate-500 font-medium">@{user?.email?.split('@')[0]}</p>

            {user?.bio && (
                <p className="mt-4 text-[16px] text-slate-800 font-medium leading-snug">
                    {user.bio}
                </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-slate-500 font-medium">
                {user?.location && (
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} /> {user.location}
                    </div>
                )}
                {user?.website && (
                    <div className="flex items-center gap-1.5 text-blue-500 hover:underline cursor-pointer">
                        <LinkIcon size={16} /> {user.website.replace(/^https?:\/\//, '')}
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <Calendar size={16} /> Joined {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Recently'}
                </div>
            </div>

            <p className="mt-4 text-[15px] font-bold text-slate-900">
                <span className="text-orange-400 text-lg">★</span> {user?.rating || '0.0'} Reputation
            </p>

            {/* Profile Stats Cards */}
            <div className="mt-8 grid grid-cols-3 border-t border-b border-slate-50 py-6">
                <div className="text-center border-r border-slate-50 px-2">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1">Bounty Earnings</p>
                    <p className="text-xl md:text-2xl font-black text-blue-500">$0.00</p>
                </div>
                <div className="text-center border-r border-slate-50 px-2">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1">Completed Tasks</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900">0</p>
                </div>
                <div className="text-center px-2">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1">Success Rate</p>
                    <p className="text-xl md:text-2xl font-black text-green-500">100%</p>
                </div>
            </div>
        </div>
    )
}
