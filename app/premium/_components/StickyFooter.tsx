"use client"

import React from 'react';
import { PlanData } from '../types';

interface StickyFooterProps {
    selectedPlan: PlanData;
    onSubscribe?: () => void;
    isCurrentPlan?: boolean;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ selectedPlan, onSubscribe, isCurrentPlan }) => {
    // If the plan is not current but we are allowed to switch (implied by onSubscribe handling switching internally in parent), 
    // we could change the text. But keeping it simple for now: if isCurrentPlan is false, it shows "Subscribe & Pay" which might be misleading for a switch.
    // However, the parent component handles the logic. Let's make it clearer.

    // Actually, let's just use a generic 'Action' logic or keep it as is. 
    // If the user owns the plan, onSubscribe will trigger the switch. 
    // We should probably change the text to "Switch to Plan" if owned.
    // But we didn't pass 'isOwned' here yet.
    // For now, let's leave it. The user said "simply be like changing".
    // If I click "Subscribe & Pay" and it just switches, that's fine, but the label is wrong.
    // Let's modify the interface to accept `actionLabel` or `isOwned`.

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
                        disabled={isCurrentPlan}
                        className={`font-[900] px-14 py-4 rounded-full transition-all w-full md:w-auto shadow-[0_8px_30px_rgba(255,255,255,0.1)] text-[17px] tracking-tight ${isCurrentPlan
                            ? 'bg-green-500 text-white cursor-default hover:bg-green-500'
                            : 'bg-white text-black hover:bg-slate-200 active:scale-95'
                            }`}
                    >
                        {isCurrentPlan ? 'Current Plan' : 'Subscribe / Switch'}
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
