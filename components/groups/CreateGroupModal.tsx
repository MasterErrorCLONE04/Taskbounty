'use client'

import { useState } from 'react'
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { createGroup } from "@/actions/groups"
import { useFormStatus } from 'react-dom'
import { Upload, X } from 'lucide-react'

// Placeholder for Submit Button with Loading State
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            disabled={pending}
        >
            {pending ? 'Creating...' : 'Create Group'}
        </Button>
    )
}

interface CreateGroupModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
    const [error, setError] = useState<string | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Handle form submission
    async function handleSubmit(formData: FormData) {
        setError(null)
        const result = await createGroup(null, formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            onClose()
            // Optional: redirect to new group page
        }
    }

    // Handle avatar change (mock for now, ideally upload to storage)
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setAvatarPreview(objectUrl)
            // In a real app, you'd upload here and set hidden input value
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Group">
            <div className="p-6 pt-2">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Start a Community</h2>
                    <p className="text-slate-500 text-sm">Create a space for tasks, discussions, and collaboration.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400 group-hover:bg-indigo-50">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-slate-400 group-hover:text-indigo-500" size={32} />
                                )}
                            </div>
                            <input
                                type="file"
                                name="avatar" // This needs handling in server action if we support file upload
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleAvatarChange}
                            />
                            {/* Hidden input to pass avatar URL if handled elsewhere or mock */}
                            <input type="hidden" name="avatar_url" value={avatarPreview || ''} />
                            <p className="text-xs text-center mt-2 text-slate-500 font-medium">Group Icon</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Group Name</label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. React Developers, Crypto Enthusiasts"
                                required
                                className="bg-slate-50 border-slate-200 focus:bg-white transition-all text-base py-6"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Description</label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What is this group about?"
                                className="bg-slate-50 border-slate-200 focus:bg-white transition-all min-h-[100px] resize-none text-base"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <SubmitButton />
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full mt-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
