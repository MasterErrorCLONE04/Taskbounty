
"use client"

import { useState } from "react"
import { TasksHeader } from "@/components/tasks/TasksHeader"
import { TasksFilter } from "@/components/tasks/TasksFilter"
import { TasksTabs } from "@/components/tasks/TasksTabs"
import { TaskCard, TaskItemProps } from "@/components/tasks/TaskCard"

export function TasksFeed({ tasks = [] }: { tasks?: TaskItemProps[] }) {
    const [activeTab, setActiveTab] = useState('Active')

    // Mock data removed in favor of props
    // Filter tasks based on activeTab
    const filteredTasks = tasks.filter(task => {
        const s = task.status;
        if (activeTab === 'Active') return ['OPEN'].includes(s);
        if (activeTab === 'Pending') return ['ASSIGNED', 'IN_PROGRESS', 'IN PROGRESS', 'SUBMITTED', 'REVIEWING'].includes(s);
        if (activeTab === 'Completed') return ['COMPLETED', 'ESCROW ACTIVE'].includes(s);
        if (activeTab === 'Disputed') return ['DISPUTED'].includes(s);
        return false;
    });

    const counts = {
        'Active': tasks.filter(t => ['OPEN'].includes(t.status)).length,
        'Pending': tasks.filter(t => ['ASSIGNED', 'IN_PROGRESS', 'IN PROGRESS', 'SUBMITTED', 'REVIEWING'].includes(t.status)).length,
        'Completed': tasks.filter(t => ['COMPLETED', 'ESCROW ACTIVE'].includes(t.status)).length,
        'Disputed': tasks.filter(t => ['DISPUTED'].includes(t.status)).length
    }

    return (
        <div className="flex flex-col min-h-full">
            <TasksHeader />
            <TasksFilter />
            <TasksTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
            <div className="flex flex-col pb-20">
                {filteredTasks.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-medium">
                        No tasks found in this category.
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    )
}
