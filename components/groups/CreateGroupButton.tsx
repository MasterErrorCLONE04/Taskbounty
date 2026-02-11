'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CreateGroupModal } from './CreateGroupModal'
import { useAuthModal } from '@/components/auth/AuthModalContext'
import { supabase } from '@/lib/supabase/client'

export function CreateGroupButton() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { openLogin } = useAuthModal()

    const handleCreateClick = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            openLogin()
            return
        }
        setIsModalOpen(true)
    }

    return (
        <>
            <Button
                onClick={handleCreateClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
                <Plus size={20} />
                Create Group
            </Button>

            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
