import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taskbounty.vercel.app'

    // Static routes
    const routes = [
        '',
        '/premium',
        '/jobs',
        '/freelancers',
        '/auth/login',
        '/auth/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes (Tasks)
    const supabase = await createClient()
    const { data: tasks } = await supabase
        .from('tasks')
        .select('id, created_at')
        .eq('status', 'OPEN')
        .limit(100)
        .order('created_at', { ascending: false })

    const taskRoutes = tasks?.map((task) => ({
        url: `${baseUrl}/tasks/${task.id}`,
        lastModified: new Date(task.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    })) || []

    return [...routes, ...taskRoutes]
}
