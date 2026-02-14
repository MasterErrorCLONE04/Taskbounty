"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, ShieldCheck, Zap, Star, BarChart2, Edit, Bookmark, Briefcase, DollarSign, Crown } from 'lucide-react'
import { BillingCycle, PlanData, Tier } from './types'
import Header from './_components/Header'
import PricingCards from './_components/PricingCards'
import StickyFooter from './_components/StickyFooter'
import ComparisonTable from './_components/ComparisonTable'
import BusinessBanner from './_components/BusinessBanner'
import { getUserPlan, getUserOwnedPlans, switchUserPlan } from '@/actions/premium'

export default function PremiumPage() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY)
    const [selectedPlan, setSelectedPlan] = useState<Tier>(Tier.PREMIUM)
    const [currentPlanId, setCurrentPlanId] = useState<Tier | null>(null)
    const [ownedPlans, setOwnedPlans] = useState<Tier[]>([])
    const [isSwitching, setIsSwitching] = useState(false)

    React.useEffect(() => {
        // Fetch current active plan
        getUserPlan().then(plan => {
            console.log('Fetched Plan:', plan)
            if (plan) {
                setCurrentPlanId(plan)
                setSelectedPlan(plan) // Select user's plan by default
            }
        })

        // Fetch all owned plans
        getUserOwnedPlans().then(plans => {
            console.log('Owned Plans:', plans)
            setOwnedPlans(plans)
        })
    }, [])

    const router = useRouter()

    const calculatePrice = (basePrice: number) => {
        if (billingCycle === BillingCycle.ANNUAL) {
            return Math.floor(basePrice * 0.88); // 12% annual discount
        }
        return basePrice;
    }

    const handleSubscribe = () => {
        if (selectedPlan === currentPlanId) return;

        // If user owns the plan but it's not active, switch to it
        if (ownedPlans.includes(selectedPlan)) {
            handleSwitchPlan(selectedPlan)
            return
        }

        const price = currentPlan.price;
        router.push(`/premium/checkout?plan=${selectedPlan}&cycle=${billingCycle}&price=${price}`);
    }

    const handleSwitchPlan = async (tier: Tier) => {
        if (isSwitching) return
        setIsSwitching(true)
        try {
            await switchUserPlan(tier)
            setCurrentPlanId(tier)
            // Optional: Show toast success
            window.location.reload() // Force reload to ensure everything updates
        } catch (err) {
            console.error('Failed to switch plan:', err)
            // Optional: Show toast error
        } finally {
            setIsSwitching(false)
        }
    }

    // Prices and Plans Data
    const plans: PlanData[] = [
        {
            id: Tier.BASIC,
            name: 'Basic',
            price: calculatePrice(8598),
            currency: 'COP',
            originalPrice: billingCycle === BillingCycle.ANNUAL ? 8598 : null,
            features: [
                { icon: <Briefcase className="w-5 h-5" />, text: 'Apply to +5 extra tasks/day' },
                { icon: <Bookmark className="w-5 h-5" />, text: 'Bookmark favorite tasks' },
                { icon: <Zap className="w-5 h-5" />, text: 'Standard support access' },
                { icon: <Edit className="w-5 h-5" />, text: 'Edit your applications' },
                { icon: <Star className="w-5 h-5" />, text: 'Basic Worker Badge' },
            ]
        },
        {
            id: Tier.PREMIUM,
            name: 'Premium',
            price: calculatePrice(10950),
            currency: 'COP',
            originalPrice: billingCycle === BillingCycle.ANNUAL ? 10950 : 21900,
            discount: billingCycle === BillingCycle.ANNUAL ? '12% off annually' : '50% off for 2 months',
            isPopular: true,
            features: [
                { text: 'Everything in Basic, and' },
                { icon: <ShieldCheck className="w-5 h-5" />, text: 'Verified Worker Checkmark', highlight: true },
                { icon: <Zap className="w-5 h-5" />, text: 'Priority Ranking in Applications' },
                { icon: <DollarSign className="w-5 h-5" />, text: '0% Fees on Withdrawals' },
                { icon: <Crown className="w-5 h-5" />, text: 'Access Exclusive High-Ticket Bounties' },
            ]
        },
        {
            id: Tier.PREMIUM_PLUS,
            name: 'Premium+',
            price: calculatePrice(82625),
            currency: 'COP',
            originalPrice: billingCycle === BillingCycle.ANNUAL ? 82625 : 165250,
            discount: billingCycle === BillingCycle.ANNUAL ? '12% off annually' : '50% off for 2 months',
            features: [
                { text: 'Everything in Premium, and' },
                { icon: <Zap className="w-5 h-5" />, text: 'Instant Payouts (No waiting)', highlight: true },
                { icon: <Star className="w-5 h-5" />, text: 'Dedicated Account Manager' },
                { icon: <BarChart2 className="w-5 h-5" />, text: 'Advanced Market Analytics' },
                { icon: <Crown className="w-5 h-5" />, text: 'Featured Profile on Homepage' },
            ]
        }
    ]

    const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1]

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-x-hidden">

            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none fixed"></div>
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent pointer-events-none z-0"></div>

            {/* Close Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="p-2 rounded-full bg-black/50 hover:bg-white/10 transition-colors block">
                    <X className="w-6 h-6 text-white" />
                </Link>
            </div>

            <main className="flex-1 w-full px-4 pb-40 flex flex-col items-center relative z-10">
                <div className="w-full max-w-6xl mx-auto">
                    <Header billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

                    <PricingCards
                        plans={plans}
                        selectedTier={selectedPlan}
                        onSelect={setSelectedPlan}
                        currentPlan={currentPlanId}
                        ownedPlans={ownedPlans}
                        onSwitch={handleSwitchPlan}
                    />

                    <ComparisonTable />

                    <BusinessBanner />
                </div>
            </main>

            <StickyFooter
                selectedPlan={currentPlan}
                onSubscribe={handleSubscribe}
                isCurrentPlan={selectedPlan === currentPlanId}
            // Determine if we should show 'Switch' instead of 'Subscribe'
            // This logic can be handled inside StickyFooter if we pass ownedPlans, or simplistically here:
            // Actually StickyFooter accepts isCurrentPlan. We might want to add isOwned prop.
            />
        </div>
    )
}
