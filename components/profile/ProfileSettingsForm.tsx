'use client'

import React, { useState } from 'react'
import { User, Tag, FileText, Save, Loader2, CheckCircle2, Plus, X, Camera, BadgeCheck, Zap } from 'lucide-react'
import { updateProfile, uploadAvatar, purchaseVerification } from '@/actions/profile'

interface ProfileSettingsFormProps {
    initialData: {
        name: string
        bio: string | null
        skills: string[]
        avatar_url: string | null
        is_verified?: boolean
        verified_until?: string | null
    }
}

export default function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url)
    const [isVerified, setIsVerified] = useState(initialData.is_verified)
    const [verifiedUntil, setVerifiedUntil] = useState(initialData.verified_until)
    const [formData, setFormData] = useState({
        name: initialData.name,
        bio: initialData.bio || '',
        skills: initialData.skills || []
    })
    const [newSkill, setNewSkill] = useState('')

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setAvatarLoading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        try {
            const result = await uploadAvatar(uploadFormData)
            if (result.success) {
                setAvatarUrl(result.avatarUrl)
            }
        } catch (error) {
            alert('Error al subir la imagen')
        } finally {
            setAvatarLoading(false)
        }
    }

    const handlePurchaseVerification = async () => {
        if (!confirm('¿Deseas comprar la verificación profesional por $3 USD? Serás redirigido a la pasarela de Stripe.')) return

        setVerifyLoading(true)
        try {
            const result = await purchaseVerification()
            if (result.success && result.url) {
                // Redirect to Stripe Checkout
                window.location.href = result.url
            }
        } catch (error: any) {
            alert(error.message || 'Error al procesar la compra')
        } finally {
            setVerifyLoading(false)
        }
    }

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSkill.trim() || formData.skills.includes(newSkill.trim())) return

        setFormData({
            ...formData,
            skills: [...formData.skills, newSkill.trim()]
        })
        setNewSkill('')
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        try {
            await updateProfile(formData)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            alert('Error al actualizar el perfil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
            <header className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-lg shadow-sky-500/20">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mi Perfil Profesional</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Personaliza cómo te ven los clientes</p>
                </div>
            </header>

            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] mb-10 relative group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white mb-4">
                    {avatarLoading ? (
                        <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-sm flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                        </div>
                    ) : null}
                    <img
                        src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Cambiar</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={avatarLoading}
                        />
                    </label>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Haz click para subir una nueva foto</p>
            </div>

            {/* Verification Badge Section */}
            <div className={`p-8 rounded-[2.5rem] border mb-12 flex flex-col md:flex-row items-center gap-8 transition-all ${isVerified ? 'bg-sky-500 text-white border-sky-400 shadow-xl shadow-sky-500/20' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isVerified ? 'bg-white text-sky-500' : 'bg-white text-slate-300'}`}>
                    <BadgeCheck className={`w-12 h-12 ${isVerified ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h4 className={`text-xl font-black uppercase tracking-tighter mb-2 ${isVerified ? 'text-white' : 'text-slate-900'}`}>
                        {isVerified ? 'Profesional Verificado' : 'Consigue tu Insignia de Confianza'}
                    </h4>
                    <p className={`text-xs font-medium leading-relaxed ${isVerified ? 'text-sky-100' : 'text-slate-500'}`}>
                        {isVerified
                            ? `Tu cuenta está verificada ${verifiedUntil ? `hasta el ${new Date(verifiedUntil).toLocaleDateString()}` : 'permanentemente'}. Los clientes confían más en profesionales verificados.`
                            : 'Aumenta tus probabilidades de ser contratado en un 300% con la insignia de verificación profesional por solo $3/mes.'}
                    </p>
                </div>
                {!isVerified ? (
                    <button
                        type="button"
                        onClick={handlePurchaseVerification}
                        disabled={verifyLoading}
                        className="shrink-0 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl"
                    >
                        {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />}
                        Verificarme por $3
                    </button>
                ) : (
                    <div className="px-6 py-3 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Activo
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="name">Nombre Público</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            id="name"
                            type="text"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="bio">Biografía Profesional</label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                        <textarea
                            id="bio"
                            rows={4}
                            placeholder="Ej: Desarrollador Full-stack con 5 años de experiencia en React y Node.js..."
                            className="w-full px-4 py-4 pl-12 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                </div>

                {/* Skills Tagging */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Habilidades y Tags
                    </label>

                    <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                        {formData.skills.length === 0 && (
                            <span className="text-xs text-slate-300 font-medium italic">No has añadido habilidades aún...</span>
                        )}
                        {formData.skills.map((skill) => (
                            <span key={skill} className="group flex items-center gap-2 px-3 py-1 bg-sky-500 text-white rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm animate-in zoom-in duration-200">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="p-0.5 hover:bg-sky-600 rounded-full transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Escribe una habilidad (ej: SEO)"
                            className="flex-grow h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                        />
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            className="h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Añadir
                        </button>
                    </div>
                </div>
            </div>

            <footer className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Cualquier usuario puede ver tu perfil público</p>
                <button
                    type="submit"
                    disabled={loading}
                    className={`h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl
                        ${success ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-sky-500 text-white hover:opacity-90 shadow-sky-500/20'}
                    `}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" /> Perfil Guardado
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" /> Actualizar Perfil
                        </>
                    )}
                </button>
            </footer>
        </form>
    )
}
