'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type FilePurpose = 'deliverable' | 'evidence' | 'asset'

/**
 * Upload a file to Supabase Storage and register in database
 */
export async function uploadFile(
    taskId: string,
    purpose: FilePurpose,
    formData: FormData
) {
    const supabase = await createClient()
    const file = formData.get('file') as File

    if (!file) throw new Error('No se proporcionó ningún archivo')

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('No autorizado')

    // 2. Fetch task to verify participation
    const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('client_id, assigned_worker_id')
        .eq('id', taskId)
        .single()

    if (taskError || !task) throw new Error('Tarea no encontrada')

    const isParticipant = user.id === task.client_id || user.id === task.assigned_worker_id
    if (!isParticipant) throw new Error('No tienes permiso para subir archivos a esta tarea')

    // 3. Prepare storage path: tasks/[taskId]/[purpose]/[timestamp]-[filename]
    const cleanFileName = file.name.replace(/[^\x00-\x7F]/g, "") // Basic ASCII cleanup
    const path = `${taskId}/${purpose}/${Date.now()}-${cleanFileName}`

    // 4. Upload to Storage
    const { data: storageData, error: storageError } = await supabase
        .storage
        .from('task-files')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (storageError) {
        console.error('Storage Error:', storageError)
        throw new Error('Error al subir el archivo al almacenamiento')
    }

    // 5. Register in Database
    const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
            task_id: taskId,
            uploader_id: user.id,
            name: file.name,
            path: path,
            size: file.size,
            type: file.type,
            purpose: purpose
        })
        .select()
        .single()

    if (dbError) {
        // Rollback storage if DB fails
        await supabase.storage.from('task-files').remove([path])
        console.error('DB Error:', dbError)
        throw new Error('Error al registrar el archivo en la base de datos')
    }

    revalidatePath(`/tasks/${taskId}/work`)
    return { success: true, file: fileRecord }
}

/**
 * Delete a file from both database and storage
 */
export async function deleteFile(fileId: string) {
    const supabase = await createClient()

    // 1. Get file record
    const { data: file, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single()

    if (fetchError || !file) throw new Error('Archivo no encontrado')

    // 2. Auth check (only uploader)
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id !== file.uploader_id) throw new Error('No tienes permiso para borrar este archivo')

    // 3. Delete from Storage
    const { error: storageError } = await supabase
        .storage
        .from('task-files')
        .remove([file.path])

    if (storageError) {
        console.error('Storage Delete Error:', storageError)
        // We continue even if storage fail (or maybe should we stop?)
    }

    // 4. Delete from DB
    const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

    if (dbError) throw dbError

    revalidatePath(`/tasks/${file.task_id}/work`)
    return { success: true }
}

/**
 * Get files for a task
 */
export async function getTaskFiles(taskId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

/**
 * Get a Signed URL for downloading/viewing a file
 */
export async function getFileUrl(path: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .storage
        .from('task-files')
        .createSignedUrl(path, 60 * 60) // 1 hour

    if (error) throw error
    return data.signedUrl
}
