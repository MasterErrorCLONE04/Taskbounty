'use client'

import React, { useState } from 'react'
import { File, Download, Trash2, Clock, LucideIcon, Image, FileText, FileCode, Archive } from 'lucide-react'
import { deleteFile, getFileUrl } from '@/actions/files'

interface TaskFile {
    id: string
    name: string
    path: string
    size: number
    type: string
    purpose: string
    created_at: string
}

interface FileGalleryProps {
    files: TaskFile[]
    canDelete?: boolean
}

export default function FileGallery({ files, canDelete = false }: FileGalleryProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return

        setDeletingId(id)
        try {
            await deleteFile(id)
        } catch (error) {
            alert('Error al eliminar el archivo')
        } finally {
            setDeletingId(null)
        }
    }

    const handleDownload = async (path: string, name: string) => {
        try {
            const url = await getFileUrl(path)
            const link = document.createElement('a')
            link.href = url
            link.download = name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            alert('Error al descargar el archivo')
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (type: string): LucideIcon => {
        if (type.startsWith('image/')) return Image
        if (type.includes('pdf') || type.includes('word') || type.includes('text')) return FileText
        if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return Archive
        if (type.includes('json') || type.includes('js') || type.includes('py') || type.includes('html')) return FileCode
        return File
    }

    if (files.length === 0) return null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file) => {
                const FileIcon = getFileIcon(file.type)
                const isDeleting = deletingId === file.id

                return (
                    <div
                        key={file.id}
                        className="group flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 transition-all"
                    >
                        <div className="flex-shrink-0 p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                            <FileIcon className="w-6 h-6" />
                        </div>

                        <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate mb-0.5">
                                {file.name}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                <span>{formatSize(file.size)}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(file.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDownload(file.path, file.name)}
                                className="p-2 hover:bg-sky-50 text-sky-500 rounded-xl transition-colors"
                                title="Descargar"
                            >
                                <Download className="w-4 h-4" />
                            </button>

                            {canDelete && (
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    disabled={isDeleting}
                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-xl transition-colors"
                                    title="Eliminar"
                                >
                                    {isDeleting ? <Clock className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
