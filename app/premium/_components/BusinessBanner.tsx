"use client"

import React from 'react';
import { Briefcase } from 'lucide-react';

const BusinessBanner: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-24 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/[0.05] transition-all">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center ring-1 ring-yellow-500/30 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-7 h-7 text-yellow-500" />
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-bold text-xl text-white mb-1">Are you a business?</h4>
                    <p className="text-white/50 text-base leading-snug">Gain credibility and grow faster with specialized tools.</p>
                </div>
            </div>
            <button className="bg-white text-black font-extrabold px-10 py-4 rounded-full hover:bg-slate-200 active:scale-95 transition-all shadow-xl whitespace-nowrap">
                Explore Premium Business
            </button>
        </div>
    );
};

export default BusinessBanner;
