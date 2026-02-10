
import { Button } from "@/components/ui/Button"

export function TasksHeader() {
    return (
        <div className="p-4 flex justify-between items-center bg-white sticky top-0 z-10">
            <h1 className="text-xl font-bold text-slate-900">My Tasks</h1>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-[14px] shadow-sm h-auto">
                Post New Task
            </Button>
        </div>
    )
}
