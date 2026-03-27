"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal"

export function TasksHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className="p-4 flex justify-between items-center bg-white sticky top-0 z-10">
                <h1 className="text-xl font-bold text-slate-900">My Tasks</h1>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-[14px] shadow-sm h-auto transition-transform active:scale-95"
                >
                    Post New Task
                </Button>
            </div>

            <CreateTaskModal 
                isOpen={isModalOpen} 
                onCloseAction={() => setIsModalOpen(false)} 
            />
        </>
    )
}
