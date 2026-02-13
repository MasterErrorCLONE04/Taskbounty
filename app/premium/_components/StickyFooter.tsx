"use client"

import React from 'react';
import { PlanData } from '../types';

interface StickyFooterProps {
    selectedPlan: PlanData;
    onSubscribe?: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ selectedPlan, onSubscribe }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl z-50 py-6 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left w-full md:w-auto">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                            Selected: {selectedPlan.name}
                        </span>
                        {selectedPlan.originalPrice && (
                            <span className="bg-blue-500/20 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                50% OFF
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-3">
                        {selectedPlan.originalPrice && (
                            <span className="text-white/40 line-through text-base font-medium">
                                COP {selectedPlan.originalPrice.toLocaleString('es-CO')}
                            </span>
                        )}
                        <span className="text-2xl font-[900] text-white tracking-tight">
                            COP {selectedPlan.price.toLocaleString('es-CO')}
                        </span>
                        <span className="text-white/50 text-sm font-medium">/ month</span>
                    </div>
                    {selectedPlan.originalPrice && (
                        <p className="text-[10px] text-white/40 mt-1 font-medium italic">
                            Limited time offer for the first 2 months
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                    <button
                        onClick={onSubscribe}
                        className="bg-white text-black font-[900] px-14 py-4 rounded-full hover:bg-slate-200 active:scale-95 transition-all w-full md:w-auto shadow-[0_8px_30px_rgba(255,255,255,0.1)] text-[17px] tracking-tight"
                    >
                        Subscribe & Pay
                    </button>
                    <p className="text-[9px] text-white/30 mt-3 text-center md:text-right max-w-[280px] leading-relaxed font-medium">
                        By subscribing, you agree to our <a className="underline text-white/50 hover:text-white transition-colors" href="#">Terms of Service</a>.
                        Subscription auto-renews until cancelled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StickyFooter;
