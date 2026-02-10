
import { CheckCircle2, MoreHorizontal, MessageCircle, Repeat2, Heart } from 'lucide-react'

export function ProfileFeed() {
    return (
        <div className="flex flex-col pb-20">
            {/* Completed Bounty Item */}
            <div className="p-6 border-b border-slate-50 hover:bg-slate-50/30 transition-all">
                <div className="flex gap-4">
                    <img src="https://ui-avatars.com/api/?name=Marcus+Chen&background=random" className="w-12 h-12 rounded-full shadow-sm" alt="Marcus" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[15px]">Marcus Chen</span>
                                <span className="text-slate-500 text-[14px]">@mchen · 14m</span>
                            </div>
                            <button className="text-slate-400 hover:text-blue-500"><MoreHorizontal size={18} /></button>
                        </div>
                        <p className="text-[12px] text-slate-400 mt-0.5">Alex completed this bounty</p>
                        <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">
                            Optimized the React state management for a high-traffic dashboard. Reduced re-renders by 60% using Redux Toolkit selectors.
                        </p>

                        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Bounty Earned</p>
                                <p className="text-xl font-black text-slate-900">$120 USDC</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                <CheckCircle2 size={14} className="text-green-600" />
                                <span className="text-[10px] font-black text-green-700 uppercase">Completed</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4 text-slate-400 font-medium text-[13px]">
                            <button className="flex items-center gap-1.5 hover:text-blue-500"><MessageCircle size={18} /> 4</button>
                            <button className="flex items-center gap-1.5 hover:text-green-500"><Repeat2 size={18} /> 1</button>
                            <button className="flex items-center gap-1.5 hover:text-red-500"><Heart size={18} /> 28</button>
                            <button className="text-blue-500 font-bold ml-auto hover:underline">View details</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Bounty Item */}
            <div className="p-6 border-b border-slate-50 hover:bg-slate-50/30 transition-all">
                <div className="flex gap-4">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=random" className="w-12 h-12 rounded-full shadow-sm" alt="Sarah" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[15px]">Sarah Johnson</span>
                                <span className="text-slate-500 text-[14px]">@s_johnson · 2d</span>
                            </div>
                            <button className="text-slate-400 hover:text-blue-500"><MoreHorizontal size={18} /></button>
                        </div>
                        <p className="text-[12px] text-slate-400 mt-0.5">Alex posted this bounty</p>
                        <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">
                            Looking for a UI designer to create custom icons for the TaskBounty dashboard. Need 24 vector icons in a minimalist style.
                        </p>

                        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Active Bounty</p>
                                <p className="text-xl font-black text-slate-900">$350 USDC</p>
                            </div>
                            <button className="px-8 py-2 bg-blue-500 text-white font-black rounded-full text-[14px] shadow-sm hover:bg-blue-600 transition-all">
                                Apply
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-4 text-slate-400 font-medium text-[13px]">
                            <button className="flex items-center gap-1.5 hover:text-blue-500"><MessageCircle size={18} /> 12</button>
                            <button className="flex items-center gap-1.5 hover:text-green-500"><Repeat2 size={18} /> 5</button>
                            <button className="flex items-center gap-1.5 hover:text-red-500"><Heart size={18} /> 54</button>
                            <button className="text-blue-500 font-bold ml-auto hover:underline">15 applications</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
