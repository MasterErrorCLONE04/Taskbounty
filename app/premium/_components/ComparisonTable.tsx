"use client"

import React from 'react';
import { Check, X } from 'lucide-react';

const ComparisonTable: React.FC = () => {
    const checkMark = <Check className="w-5 h-5 text-blue-500 font-bold" strokeWidth={3} />;
    const closeIcon = <X className="w-5 h-5 text-white/20" />;

    const sections = [
        {
            title: 'Enhanced Experience',
            rows: [
                { name: 'Application Limit', basic: '5/day', premium: '20/day', plus: 'Unlimited' },
                { name: 'Priority Ranking', basic: 'Standard', premium: 'High', plus: 'Top Tier' },
                { name: 'Edit Applications', basic: checkMark, premium: checkMark, plus: checkMark },
            ]
        },
        {
            title: 'Earnings & Fees',
            rows: [
                { name: 'Withdrawal Fees (Crypto)', basic: '2.5%', premium: '1%', plus: '0%' },
                { name: 'Instant Payouts', basic: closeIcon, premium: closeIcon, plus: checkMark },
            ]
        },
        {
            title: 'Professional Tools',
            rows: [
                { name: 'Advanced Analytics', basic: closeIcon, premium: checkMark, plus: checkMark },
                { name: 'Verified Badge', basic: closeIcon, premium: checkMark, plus: checkMark },
            ]
        }
    ];

    return (
        <section className="mb-32 w-full max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 tracking-tight text-white text-center md:text-left">Compare tiers & features</h2>

            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="grid grid-cols-4 px-4 md:px-8 py-4 bg-white/[0.05] border-b border-white/10 font-black text-[10px] uppercase tracking-widest text-white/40">
                    <div className="col-span-1">Feature</div>
                    <div className="text-center">Basic</div>
                    <div className="text-center">Premium</div>
                    <div className="text-center">Premium+</div>
                </div>

                {sections.map((section, idx) => (
                    <React.Fragment key={idx}>
                        <div className="bg-white/[0.03] px-4 md:px-8 py-3 border-b border-white/10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">{section.title}</h3>
                        </div>
                        {section.rows.map((row, rIdx) => (
                            <div
                                key={rIdx}
                                className={`grid grid-cols-4 px-4 md:px-8 py-4 md:py-6 items-center border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02] transition-colors`}
                            >
                                <div className="text-[13px] md:text-[15px] font-semibold text-white/90">{row.name}</div>
                                <div className="text-center text-xs md:text-sm font-medium text-white/50 flex justify-center">{row.basic}</div>
                                <div className="text-center text-xs md:text-sm font-medium text-white/70 flex justify-center">{row.premium}</div>
                                <div className="text-center text-[13px] md:text-[15px] font-bold text-white flex justify-center">{row.plus}</div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default ComparisonTable;
