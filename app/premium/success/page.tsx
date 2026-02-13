"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, User } from 'lucide-react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { createBrowserClient } from '@supabase/ssr'

export default function PremiumSuccessPage() {
    const [mounted, setMounted] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    const [verifying, setVerifying] = useState(true)
    const [searchParams] = useState(new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''))

    useEffect(() => {
        setMounted(true)

        const verify = async () => {
            const paymentIntentId = searchParams.get('payment_intent')
            if (paymentIntentId) {
                // Import dynamically to avoid server action issues in useEffect if not handled correctly
                const { verifyPaymentAndActivateSubscription } = await import('@/actions/premium')
                await verifyPaymentAndActivateSubscription(paymentIntentId)
                setVerifying(false)
            } else {
                setVerifying(false)
            }
        }

        verify()

        // Trigger confetti
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) {
                return clearInterval(interval)
            }
            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
        }, 250)

        // Fetch user ID
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id)
        })

        return () => clearInterval(interval)
    }, [searchParams])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#000000_100%)] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.6)]"
                >
                    <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-white/60 mb-8">
                    Bienvenido a Premium. Tu suscripción ha sido activada correctamente. Ahora disfrutas de todos los beneficios exclusivos.
                </p>

                <div className="space-y-4">
                    {userId ? (
                        <Link
                            href={`/profile/${userId}`}
                            className="block w-full bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                            Ir a Mi Perfil
                            <User className="w-5 h-5" />
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="block w-full bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                            Ir al Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="block w-full py-4 rounded-xl hover:bg-white/5 transition-colors text-white/50 font-medium"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
