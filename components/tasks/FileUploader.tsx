'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, File, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { uploadFile, FilePurpose } from '@/actions/files'

interface FileUploaderProps {
    taskId: string
    purpose: FilePurpose
    onUploadSuccess?: () => void
    label?: string
}

export default function FileUploader({ taskId, purpose, onUploadSuccess, label }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        startUpload(file)
    }

    const startUpload = async (file: File) => {
        setUploading(true)
        setStatus('idle')
        setErrorMessage('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await uploadFile(taskId, purpose, formData)
            if (result.success) {
                setStatus('success')
                if (onUploadSuccess) onUploadSuccess()
                // Reset after 3 seconds
                setTimeout(() => setStatus('idle'), 3000)
            }
        } catch (error: any) {
            console.error('Upload Error:', error)
            setStatus('error')
            setErrorMessage(error.message || 'Error al subir el archivo')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="w-full">
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={uploading}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`w-full group relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-8 transition-all
                    ${status === 'success' ? 'border-green-500 bg-green-50/30' :
                        status === 'error' ? 'border-destructive/30 bg-destructive/5' :
                            'border-slate-200 hover:border-sky-500 hover:bg-sky-50/30'}
                `}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                        <span className="text-sm font-bold text-sky-600">Subiendo archivo...</span>
                    </div>
                ) : status === 'success' ? (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                        <span className="text-sm font-bold text-green-600">¡Subido con éxito!</span>
                    </div>
                ) : status === 'error' ? (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                        <AlertCircle className="w-10 h-10 text-destructive" />
                        <span className="text-sm font-bold text-destructive">{errorMessage}</span>
                        <span className="text-[10px] uppercase font-black text-slate-400 mt-2">Haz clic para reintentar</span>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-sky-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-sky-500" />
                        </div>
                        <div className="text-center">
                            <span className="block text-sm font-bold text-slate-900 mb-1">
                                {label || 'Haz clic para subir un archivo'}
                            </span>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Máximo 10MB · Formatoso comunes
                            </span>
                        </div>
                    </>
                )}
            </button>
        </div>
    )
}
