"use client"

import React from 'react';
import { PlanData, Tier } from '../types';
import { Check } from 'lucide-react';

interface PricingCardsProps {
    plans: PlanData[];
    selectedTier: Tier;
    onSelect: (tier: Tier) => void;
    currentPlan?: Tier | null;
    ownedPlans?: Tier[];
    onSwitch?: (tier: Tier) => void;
}

const PricingCards: React.FC<PricingCardsProps> = ({ plans, selectedTier, onSelect, currentPlan, ownedPlans = [], onSwitch }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 items-stretch">
            {plans.map((plan) => {
                const isOwned = ownedPlans.includes(plan.id);
                const isCurrent = currentPlan === plan.id;

                return (
                    <div
                        key={plan.id}
                        onClick={() => onSelect(plan.id)}
                        className={`relative group cursor-pointer bg-white/[0.03] border rounded-[32px] p-8 flex flex-col transition-all duration-300 ${isCurrent
                            ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-[1.03] z-20'
                            : selectedTier === plan.id
                                ? plan.isPopular ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.03] z-10 border-blue-500' : 'border-white/40 scale-[1.02] z-10'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                    >
                        {plan.badge && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20 whitespace-nowrap">
                                {plan.badge}
                            </div>
                        )}

                        {isCurrent && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-lg shadow-green-500/20 whitespace-nowrap z-30 flex items-center gap-2">
                                <Check size={12} strokeWidth={4} /> Current Plan
                            </div>
                        )}

                        {isOwned && !isCurrent && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap z-30">
                                Purchased
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6 mt-2">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${selectedTier === plan.id
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-white/20'
                                }`}>
                                {selectedTier === plan.id && (
                                    <Check className="w-4 h-4 text-white font-bold" strokeWidth={4} />
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            {plan.originalPrice && (
                                <p className="text-white/40 line-through text-lg mb-1 leading-none">
                                    COP {plan.originalPrice.toLocaleString('es-CO')}
                                </p>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className={`font-[900] tracking-tight transition-all text-white ${plan.isPopular ? 'text-4xl' : 'text-3xl'
                                    }`}>
                                    COP {plan.price.toLocaleString('es-CO')}
                                </span>
                                <span className="text-white/50 text-base font-medium">/ month</span>
                            </div>
                        </div>

                        {isOwned && !isCurrent && onSwitch && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSwitch(plan.id);
                                }}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all mb-6 border border-white/10"
                            >
                                Switch to this Plan
                            </button>
                        )}

                        {plan.id !== Tier.BASIC && (
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 transition-all ${plan.id === Tier.PREMIUM ? 'text-blue-500' : 'text-white/40'
                                }`}>
                                Everything in {plan.id === Tier.PREMIUM ? 'Basic' : 'Premium'}, plus
                            </p>
                        )}

                        <ul className="space-y-4 flex-grow">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/90 group-hover:text-white transition-colors">
                                    <span className={`flex items-center justify-center ${plan.id === Tier.PREMIUM ? 'text-blue-500' : 'text-white/40'
                                        }`}>
                                        {feature.icon || <div className="w-5 h-5 rounded-full bg-white/10" />}
                                    </span>
                                    <span className="text-[15px] font-medium leading-tight">{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    );
};

export default PricingCards;
