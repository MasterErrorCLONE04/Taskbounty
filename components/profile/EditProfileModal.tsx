
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
    const [summary, setSummary] = useState(user?.summary || "")
    const [location, setLocation] = useState(user?.location || "")
    const [website, setWebsite] = useState(user?.website || "")
    const [skills, setSkills] = useState(user?.skills?.join(', ') || "")
    const [certifications, setCertifications] = useState<any[]>(Array.isArray(user?.certifications) ? user.certifications : [])
    const [portfolio, setPortfolio] = useState<any[]>(Array.isArray(user?.portfolio) ? user.portfolio : [])
    const [experience, setExperience] = useState<any[]>(Array.isArray(user?.experience) ? user.experience : [])
    const [education, setEducation] = useState<any[]>(Array.isArray(user?.education) ? user.education : [])

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

    // Certifications Handlers
    const handleAddCertification = () => {
        setCertifications([...certifications, { title: '', issuer: '', year: new Date().getFullYear().toString() }])
    }

    const handleUpdateCertification = (index: number, field: string, value: string) => {
        const newCerts = [...certifications]
        newCerts[index] = { ...newCerts[index], [field]: value }
        setCertifications(newCerts)
    }

    const handleRemoveCertification = (index: number) => {
        setCertifications(certifications.filter((_, i) => i !== index))
    }

    // Portfolio Handlers
    const handleAddPortfolioItem = () => {
        setPortfolio([...portfolio, { title: '', description: '', link: '', image_url: '' }])
    }

    const handleUpdatePortfolioItem = (index: number, field: string, value: string) => {
        const newItems = [...portfolio]
        newItems[index] = { ...newItems[index], [field]: value }
        setPortfolio(newItems)
    }

    const handleRemovePortfolioItem = (index: number) => {
        setPortfolio(portfolio.filter((_, i) => i !== index))
    }

    // Experience Handlers
    const handleAddExperience = () => {
        setExperience([...experience, { role: '', company: '', duration: '', description: '', type: 'Full-time' }])
    }

    const handleUpdateExperience = (index: number, field: string, value: string) => {
        const newExp = [...experience]
        newExp[index] = { ...newExp[index], [field]: value }
        setExperience(newExp)
    }

    const handleRemoveExperience = (index: number) => {
        setExperience(experience.filter((_, i) => i !== index))
    }

    // Education Handlers
    const handleAddEducation = () => {
        setEducation([...education, { school: '', degree: '', duration: '' }])
    }

    const handleUpdateEducation = (index: number, field: string, value: string) => {
        const newEdu = [...education]
        newEdu[index] = { ...newEdu[index], [field]: value }
        setEducation(newEdu)
    }

    const handleRemoveEducation = (index: number) => {
        setEducation(education.filter((_, i) => i !== index))
    }

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('bio', bio)
        formData.append('summary', summary)
        formData.append('location', location)
        formData.append('website', website)
        formData.append('skills', skills)
        formData.append('certifications', JSON.stringify(certifications))
        formData.append('portfolio', JSON.stringify(portfolio))
        formData.append('experience', JSON.stringify(experience))
        formData.append('education', JSON.stringify(education))

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-none">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Edit Profile</h2>
                        <p className="text-xs text-slate-500 font-medium">Update your public information</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <form id="edit-profile-form" onSubmit={handleSubmit} className="p-0">

                        {/* Banner & Avatar Section */}
                        <div className="relative mb-24 group">
                            {/* Banner */}
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                <img
                                    src={bannerPreview || "https://picsum.photos/seed/profile-banner/1200/400"}
                                    className="w-full h-full object-cover"
                                    alt="Banner Preview"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                                <label className="absolute top-4 right-4 bg-black/60 hover:bg-black/75 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-2 backdrop-blur-md shadow-lg transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    Update Banner
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="hidden" />
                                </label>
                            </div>

                            {/* Avatar */}
                            <div className="absolute -bottom-16 left-8 z-10">
                                <div className="relative group/avatar">
                                    <div className="w-32 h-32 rounded-full border-[6px] border-white bg-white shadow-lg overflow-hidden relative">
                                        <img
                                            src={avatarPreview || `https://ui-avatars.com/api/?name=${name || 'User'}&background=random&size=300`}
                                            className="w-full h-full object-cover"
                                            alt="Avatar Preview"
                                        />
                                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                            <span className="text-white text-[10px] font-bold mt-1">CHANGE</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pb-8 space-y-10">

                            {/* Section: Basic Info */}
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4">
                                    <h3 className="text-md font-black text-slate-900 mb-1">Basic Details</h3>
                                    <p className="text-xs text-slate-500">Your primary identity information.</p>
                                </div>
                                <div className="md:col-span-8 space-y-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Display Name</label>
                                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Johnson" required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                        </div>
                                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location</label>
                                            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Headline / Short Bio</label>
                                        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Software Engineer | UI/UX Enthusiast" className="resize-none h-20 bg-slate-50 border-slate-200 focus:bg-white transition-colors leading-relaxed" />
                                        <p className="text-[11px] text-slate-400 text-right">{bio.length}/150</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5 col-span-2">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Website / Portfolio URL</label>
                                            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section: Skills & About */}
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4">
                                    <h3 className="text-md font-black text-slate-900 mb-1">About & Skills</h3>
                                    <p className="text-xs text-slate-500">Tell others about your expertise.</p>
                                </div>
                                <div className="md:col-span-8 space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top Skills</label>
                                        <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js, ..." className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                        <p className="text-[11px] text-slate-400">Separate with commas</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Summary</label>
                                        <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="I am a passionate developer with over 5 years of experience..." className="resize-none h-40 bg-slate-50 border-slate-200 focus:bg-white transition-colors leading-relaxed" />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section: Experience */}
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4">
                                    <h3 className="text-md font-black text-slate-900 mb-1">Experience</h3>
                                    <p className="text-xs text-slate-500 mb-4">Your work history.</p>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddExperience} className="w-full justify-center border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400">
                                        + Add Position
                                    </Button>
                                </div>
                                <div className="md:col-span-8 space-y-4">
                                    {experience.length === 0 && (
                                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-sm text-slate-400">No experience listed yet.</p>
                                        </div>
                                    )}
                                    {experience.map((exp, index) => (
                                        <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-blue-200 hover:shadow-md transition-all">
                                            <button type="button" onClick={() => handleRemoveExperience(index)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
                                                ✕
                                            </button>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Role</label>
                                                    <Input value={exp.role} onChange={(e) => handleUpdateExperience(index, 'role', e.target.value)} placeholder="e.g. Frontend Dev" className="h-9 text-sm font-bold" />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Company</label>
                                                    <Input value={exp.company} onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)} placeholder="e.g. Google" className="h-9 text-sm" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div className="col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Duration</label>
                                                    <Input value={exp.duration} onChange={(e) => handleUpdateExperience(index, 'duration', e.target.value)} placeholder="e.g. 2020 - Present" className="h-9 text-sm" />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Type</label>
                                                    <Input value={exp.type || ''} onChange={(e) => handleUpdateExperience(index, 'type', e.target.value)} placeholder="Full-time" className="h-9 text-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Description</label>
                                                <Textarea value={exp.description} onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)} placeholder="• Led team of 5..." className="h-20 text-sm resize-none bg-slate-50/50" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section: Education */}
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4">
                                    <h3 className="text-md font-black text-slate-900 mb-1">Education</h3>
                                    <p className="text-xs text-slate-500 mb-4">Schools and degrees.</p>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddEducation} className="w-full justify-center border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400">
                                        + Add Education
                                    </Button>
                                </div>
                                <div className="md:col-span-8 space-y-4">
                                    {education.length === 0 && (
                                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-sm text-slate-400">No education listed yet.</p>
                                        </div>
                                    )}
                                    {education.map((edu, index) => (
                                        <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-blue-200 hover:shadow-md transition-all">
                                            <button type="button" onClick={() => handleRemoveEducation(index)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
                                                ✕
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">School</label>
                                                    <Input value={edu.school} onChange={(e) => handleUpdateEducation(index, 'school', e.target.value)} className="h-9 text-sm font-bold" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Degree</label>
                                                    <Input value={edu.degree} onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)} className="h-9 text-sm" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Years</label>
                                                    <Input value={edu.duration} onChange={(e) => handleUpdateEducation(index, 'duration', e.target.value)} className="h-9 text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section: Portfolio & Certs (Grouped) */}
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4">
                                    <h3 className="text-md font-black text-slate-900 mb-1">Portfolio & Certs</h3>
                                    <p className="text-xs text-slate-500 mb-4">Showcase your work.</p>
                                    <div className="space-y-2">
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddPortfolioItem} className="w-full justify-start text-left border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400">
                                            + Add Project
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddCertification} className="w-full justify-start text-left border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400">
                                            + Add Certification
                                        </Button>
                                    </div>
                                </div>
                                <div className="md:col-span-8 space-y-6">

                                    {/* Portfolio Items */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Projects</h4>
                                        {portfolio.map((item, index) => (
                                            <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                                <button type="button" onClick={() => handleRemovePortfolioItem(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500">✕</button>
                                                <div className="grid grid-cols-2 gap-3 mb-2">
                                                    <Input value={item.title} onChange={(e) => handleUpdatePortfolioItem(index, 'title', e.target.value)} placeholder="Project Title" className="h-9 font-bold" />
                                                    <Input value={item.link} onChange={(e) => handleUpdatePortfolioItem(index, 'link', e.target.value)} placeholder="URL" className="h-9 text-blue-500" />
                                                </div>
                                                <Textarea value={item.description} onChange={(e) => handleUpdatePortfolioItem(index, 'description', e.target.value)} placeholder="One liner description" className="h-14 min-h-[56px] resize-none text-xs bg-slate-50" />
                                            </div>
                                        ))}
                                        {portfolio.length === 0 && <p className="text-xs text-slate-400 italic">No projects yet.</p>}
                                    </div>

                                    {/* Certs */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Certifications</h4>
                                        {certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                                                <Input value={cert.title} onChange={(e) => handleUpdateCertification(index, 'title', e.target.value)} placeholder="Certificate" className="h-8 text-sm border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 font-bold" />
                                                <span className="text-slate-300">|</span>
                                                <Input value={cert.issuer} onChange={(e) => handleUpdateCertification(index, 'issuer', e.target.value)} placeholder="Issuer" className="h-8 text-sm border-none shadow-none focus-visible:ring-0 bg-transparent w-32" />
                                                <span className="text-slate-300">|</span>
                                                <Input value={cert.year} onChange={(e) => handleUpdateCertification(index, 'year', e.target.value)} placeholder="Year" className="h-8 text-sm border-none shadow-none focus-visible:ring-0 bg-transparent w-16" />
                                                <button type="button" onClick={() => handleRemoveCertification(index)} className="p-1 text-slate-300 hover:text-red-500">✕</button>
                                            </div>
                                        ))}
                                        {certifications.length === 0 && <p className="text-xs text-slate-400 italic">No certifications yet.</p>}
                                    </div>
                                </div>
                            </section>

                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 flex-none z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-profile-form" disabled={isLoading} className="px-8 bg-black hover:bg-slate-800 text-white font-bold rounded-full shadow-lg shadow-black/10 active:scale-95 transition-all">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
