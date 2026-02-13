
import { BadgeCheck, MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
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
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500 fill-current ml-1" aria-label="Verified Account">
                        <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92905C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92905 19.6049L6.41553 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92905L4.32435 6.41553C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92905 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" />
                        <path d="M9 11.5L11 13.5L15 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
