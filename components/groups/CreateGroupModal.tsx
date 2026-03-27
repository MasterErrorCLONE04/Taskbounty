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
    onCloseAction: () => void
}

export function CreateGroupModal({ isOpen, onCloseAction }: CreateGroupModalProps) {
    const [error, setError] = useState<string | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    // Handle form submission
    async function handleSubmit(formData: FormData) {
        setError(null)
        const result = await createGroup(null, formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            onCloseAction()
            // Optional: redirect to new group page
        }
    }

    // Generate local preview (purely visual feedback — the actual File is sent in FormData)
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Client-side validation feedback
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten imágenes.')
            e.target.value = ''
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('La imagen no puede superar 2 MB.')
            e.target.value = ''
            return
        }

        setError(null)
        setAvatarFile(file)

        // Local object URL just for the visual preview — never sent to the server
        const previewUrl = URL.createObjectURL(file)
        if (avatarPreview) URL.revokeObjectURL(avatarPreview) // clean up previous
        setAvatarPreview(previewUrl)
    }

    const handleRemoveAvatar = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        setAvatarPreview(null)
        setAvatarFile(null)
    }

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Create New Group">
            <div className="p-6 pt-2">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Start a Community</h2>
                    <p className="text-slate-500 text-sm">Create a space for tasks, discussions, and collaboration.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {/* Avatar Upload — the file input is named "avatar" so it arrives in FormData */}
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400 group-hover:bg-indigo-50">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-slate-400 group-hover:text-indigo-500" size={32} />
                                )}
                            </div>

                            {/* Remove button */}
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors"
                                    aria-label="Remove avatar"
                                >
                                    <X size={12} />
                                </button>
                            )}

                            {/* Real file input — named "avatar" — will be sent in FormData */}
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <p className="text-xs text-center text-slate-500 font-medium">
                            Group Icon <span className="text-slate-400">(max 2 MB)</span>
                        </p>
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
                            onClick={onCloseAction}
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
