'use client'

import React, { useState } from 'react'
import { approveAndRelease } from '@/actions/closure'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useToast } from '@/components/ui/ToastProvider'

export default function ApprovalButton({ taskId }: { taskId: string }) {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { toast } = useToast()

    const handleApprove = async () => {
        setLoading(true)
        try {
            await approveAndRelease(taskId)
            setShowModal(false)
        } catch (err: any) {
            toast(err.message || 'Error al aprobar la entrega.', 'error')
            setLoading(false)
            setShowModal(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="w-full h-14 bg-primary text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        Aprobar Entrega & Pagar
                        <ShieldCheck className="w-5 h-5" />
                    </>
                )}
            </button>

            <ConfirmModal
                isOpen={showModal}
                onCloseAction={() => setShowModal(false)}
                onConfirmAction={handleApprove}
                title="¿Aprobar esta entrega?"
                description="El dinero será liberado inmediatamente al trabajador. Esta acción no se puede deshacer."
                confirmText="Sí, aprobar y pagar"
                cancelText="Cancelar"
                variant="warning"
                isLoading={loading}
            />
        </>
    )
}
