
import { Button } from "@/components/ui/Button"

interface VerifiedSkillsCardProps {
    skills?: string[]
}

export function VerifiedSkillsCard({ skills = [] }: VerifiedSkillsCardProps) {
    if (!skills || skills.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">Verified Skills</h3>
                <p className="text-slate-500 text-sm">No skills added yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-5 tracking-tight">Verified Skills</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-50 text-[13px] font-bold text-slate-600 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                        {skill}
                    </span>
                ))}
            </div>

        </div>
    )
}
