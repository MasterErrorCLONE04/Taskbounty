"use client"

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createSubscriptionPaymentIntent } from '@/actions/premium';
import { Tier } from '../types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>}>
            <CheckoutStructure />
        </Suspense>
    );
}

function CheckoutStructure() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan');
    const cycle = searchParams.get('cycle');
    const price = Number(searchParams.get('price'));

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (price && plan) {
            createSubscriptionPaymentIntent(price, plan as Tier)
                .then(data => setClientSecret(data.clientSecret))
                .catch(err => setError(err.message));
        }
    }, [price]);

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-red-500 font-bold">Error: {error}</div>
            </div>
        )
    }

    if (!clientSecret) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        )
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#3b82f6',
                colorBackground: '#1e293b',
                colorText: '#ffffff',
            },
        },
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Secure Checkout</h1>
                    <Link href="/premium" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </Link>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-400 mb-1">Premium {plan}</h3>
                        <p className="text-sm text-blue-200/70">
                            {cycle} subscription: <strong>COP {price.toLocaleString('es-CO')}</strong>
                        </p>
                    </div>
                </div>

                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm amount={price} />
                </Elements>

                <p className="text-center text-xs text-white/30 mt-6">
                    Powered by Stripe. Your payment is secure.
                </p>
            </div>
        </div>
    )
}

function CheckoutForm({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/premium/success`, // Make sure to create this page
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" />

            {message && <div className="text-red-500 text-sm font-medium">{message}</div>}

            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : `Pay COP ${amount.toLocaleString('es-CO')}`}
            </button>
        </form>
    );
}
