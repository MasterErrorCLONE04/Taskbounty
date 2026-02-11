'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuthModal } from '@/components/auth/AuthModalContext'
import { joinGroup, leaveGroup } from '@/actions/groups'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'

interface JoinGroupButtonProps {
    groupId: string
    initialIsMember: boolean
}

export function JoinGroupButton({ groupId, initialIsMember }: JoinGroupButtonProps) {
    const [isMember, setIsMember] = useState(initialIsMember)
    const [isPending, startTransition] = useTransition()
    const { openLogin } = useAuthModal()

    const handleToggleMembership = () => {
        startTransition(async () => {
            if (isMember) {
                // Optimistic update
                setIsMember(false)
                const result = await leaveGroup(groupId)
                if (result?.error) {
                    // Revert on error
                    setIsMember(true)
                    if (result.error.includes('logged in')) {
                        openLogin()
                    } else {
                        alert('Failed to leave group: ' + result.error)
                    }
                }
            } else {
                // Optimistic update
                setIsMember(true)
                const result = await joinGroup(groupId)
                if (result?.error) {
                    // Revert on error
                    setIsMember(false)
                    if (result.error.includes('logged in')) {
                        openLogin()
                    } else {
                        alert('Failed to join group: ' + result.error)
                    }
                }
            }
        })
    }

    if (isMember) {
        return (
            <Button
                onClick={handleToggleMembership}
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
                {isPending ? <Loader2 className="animate-spin" size={20} /> : <UserCheck size={20} />}
                {isPending ? 'Updating...' : 'Joined'}
            </Button>
        )
    }

    return (
        <Button
            onClick={handleToggleMembership}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
        >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
            {isPending ? 'Joining...' : 'Join Group'}
        </Button>
    )
}
