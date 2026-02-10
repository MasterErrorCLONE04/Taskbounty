
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { updateProfile } from "@/actions/profile"
import { useRouter } from "next/navigation"

interface EditProfileModalProps {
    user: any
    isOpen: boolean
    onClose: () => void
}

export function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(user?.name || "")
    const [bio, setBio] = useState(user?.bio || "")
    const [location, setLocation] = useState(user?.location || "")
    const [website, setWebsite] = useState(user?.website || "")
    const [skills, setSkills] = useState(user?.skills?.join(', ') || "")

    // Image Upload State
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || "")
    const [bannerPreview, setBannerPreview] = useState(user?.banner_url || "")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (type === 'avatar') {
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        } else {
            setBannerFile(file)
            setBannerPreview(URL.createObjectURL(file))
        }
    }

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('bio', bio)
        formData.append('location', location)
        formData.append('website', website)
        formData.append('skills', skills)
        if (avatarFile) formData.append('avatarFile', avatarFile)
        if (bannerFile) formData.append('bannerFile', bannerFile)

        try {
            await updateProfile(formData)
            onClose()
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-black text-slate-900">Edit Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Banner & Avatar Upload Section */}
                    <div className="relative mb-20">
                        {/* Banner Input */}
                        <div className="h-32 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                            <img
                                src={bannerPreview || "https://picsum.photos/seed/profile-banner/1200/400"}
                                className="w-full h-full object-cover"
                                alt="Banner Preview"
                            />
                            {/* Explicit Banner Button */}
                            <label className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 backdrop-blur-sm z-10">
                                <span>Change Banner</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'banner')}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Avatar Input */}
                        <div className="absolute -bottom-16 left-4 z-10">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group">
                                <img
                                    src={avatarPreview || `https://ui-avatars.com/api/?name=${name || 'User'}&background=random&size=300`}
                                    className="w-full h-full object-cover"
                                    alt="Avatar Preview"
                                />
                                {/* Explicit Avatar Button Overlay */}
                                <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-[10px] font-bold">Change</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {/* Explicit Avatar Button Below */}
                            <label className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-blue-500 text-[11px] font-bold cursor-pointer hover:underline bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100 mt-1">
                                Change Avatar
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Display Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Bio</label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            className="resize-none h-24"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-700">Location</label>
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-700">Website</label>
                            <Input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://your-site.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Skills (comma separated)</label>
                        <Input
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="React, Design, Python..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
