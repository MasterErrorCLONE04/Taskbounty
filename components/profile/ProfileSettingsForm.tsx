'use client'

import React, { useState } from 'react'
import { User, Tag, FileText, Save, Loader2, CheckCircle2, Plus, X } from 'lucide-react'
import { updateProfile } from '@/actions/profile'

interface ProfileSettingsFormProps {
    initialData: {
        name: string
        bio: string | null
        skills: string[]
        avatar_url: string | null
    }
}

export default function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData.name,
        bio: initialData.bio || '',
        skills: initialData.skills || []
    })
    const [newSkill, setNewSkill] = useState('')

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
