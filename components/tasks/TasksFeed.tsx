
"use client"

import { useState } from "react"
import { TasksHeader } from "@/components/tasks/TasksHeader"
import { TasksFilter } from "@/components/tasks/TasksFilter"
import { TasksTabs } from "@/components/tasks/TasksTabs"
import { TaskCard, TaskItemProps } from "@/components/tasks/TaskCard"

export function TasksFeed() {
    const [activeTab, setActiveTab] = useState('Active')

    const tasks: TaskItemProps[] = [
        {
            id: 't1',
            taskId: '#BT-9421',
            status: 'IN PROGRESS',
            title: 'Fix Redux Toolkit Persistence Issue',
            personType: 'Client',
            personName: 'Marcus Chen',
            personAvatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=random',
            amount: 120.00,
            currency: 'USDC',
            escrowActive: true,
            actions: ['Submit Work', 'Message Client']
        },
        {
            id: 't2',
            taskId: '#BT-8820',
            status: 'REVIEWING',
            title: '5 High-Fidelity Landing Page Mockups',
            personType: 'Hunter',
            personName: 'Sarah Johnson',
            personAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
            amount: 450.00,
            currency: 'USDC',
            escrowActive: true,
            actions: ['Release Funds', 'Request Revision']
        },
        {
            id: 't3',
            taskId: '#BT-9502',
            status: 'ESCROW ACTIVE',
            title: 'Solidity Smart Contract Audit',
            personType: 'Client',
            personName: 'Leo V.',
            personAvatar: 'https://ui-avatars.com/api/?name=Leo+V&background=random',
            amount: 1200.00,
            currency: 'USDC',
            escrowActive: true,
            actions: ['Start Working', 'View Brief']
        }
    ]

    return (
        <div className="flex flex-col min-h-full">
            <TasksHeader />
            <TasksFilter />
            <TasksTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex flex-col pb-20">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}
