'use client'

import React, { useState } from 'react'
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { submitRating } from '@/actions/closure'

export default function RatingForm({
    taskId,
    targetUserId,
    targetName
}: {
    taskId: string,
    targetUserId: string,
    targetName: string
}) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await submitRating(taskId, targetUserId, rating, comment)
            setSubmitted(true)
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-3xl text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
                <p className="font-bold">¡Gracias por tu feedback!</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold italic">Califica a {targetName}</h3>
                <p className="text-sm text-muted-foreground">Tu opinión ayuda a mantener la integridad del marketplace.</p>
            </div>

            <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-10 h-10 transition-all duration-300 ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                                : 'text-slate-300 fill-white hover:text-slate-400'
                                }`}
                        />
                    </button>
                ))}
            </div>

            <textarea
                placeholder="Escribe un breve comentario sobre tu experiencia..."
                className="w-full p-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <button
                disabled={loading}
                className="w-full h-14 bg-foreground text-background font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        Enviar calificación
                        <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    )
}
