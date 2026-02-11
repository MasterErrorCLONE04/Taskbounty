'use server'

import { createClient } from '@/lib/supabase/server'

export async function getQuickStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch User Rating and total completed tasks
    const { data: profile } = await supabase
        .from('users')
        .select('rating')
        .eq('id', user.id)
        .single()

    // 2. Fetch Tasks status counts
    const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('status')
        .eq('assigned_worker_id', user.id)

    if (tasksError) {
        console.error('Error fetching tasks for stats:', tasksError)
        return null
    }

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length
    const activeTasks = tasks.filter(t => ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'DISPUTED'].includes(t.status)).length

    const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
        successRate: `${successRate}%`,
        avgRating: profile?.rating || 0,
        activeBounties: activeTasks
    }
}

export async function getTrendingSkills() {
    const supabase = await createClient()

    // Fetch counts of open tasks grouped by category
    const { data, error } = await supabase
        .from('tasks')
        .select('category')
        .eq('status', 'OPEN')

    if (error) {
        console.error('Error fetching trending skills:', error)
        return []
    }

    const counts: Record<string, number> = {}
    data.forEach(t => {
        const cat = t.category || 'General'
        counts[cat] = (counts[cat] || 0) + 1
    })

    // Map to TrendingSkill format
    // For now we map category to name as well
    const trending = Object.entries(counts)
        .map(([name, count]) => ({
            name: name,
            category: name === 'Código' ? 'Development' :
                name === 'Diseño' ? 'Design' :
                    name === 'Content' ? 'Writing' :
                        name === 'Video' ? 'Media' : 'General',
            activeCount: count
        }))
        .sort((a, b) => b.activeCount - a.activeCount)
        .slice(0, 5)

    return trending
}
