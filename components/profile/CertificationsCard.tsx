
import { ShieldCheck, Award } from "lucide-react"

interface CertificationsCardProps {
    certifications?: any[]
}

export function CertificationsCard({ certifications }: CertificationsCardProps) {
    // Fallback to placeholder if empty, or just show empty state?
    // User requested "functional", so if empty, show something or nothing.
    // Let's show empty state if null, but keep the hardcoded ones as fallback if the user has NONE for demo purposes?
    // Actually, user said "show real info", so if they have none, it should be empty or say "No certifications".
    // But for "wow" factor I will default to empty array and maybe show a message.

    const displayCerts = certifications && certifications.length > 0 ? certifications : []

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Certifications</h3>
                {/* Could add an Add button here later */}
            </div>

            {displayCerts.length > 0 ? (
                <div className="space-y-6">
                    {displayCerts.map((cert: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <Award size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[14px] font-black text-slate-900 leading-tight">{cert.title || cert.name}</p>
                                <p className="text-[12px] text-slate-500 mt-1 font-medium">{cert.issuer || cert.organization} · {cert.year || cert.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-400 italic">No certifications added yet.</p>
            )}
        </div>
    )
}
