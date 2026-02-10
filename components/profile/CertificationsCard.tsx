
import { ShieldCheck, Award } from "lucide-react"

export function CertificationsCard() {
    const certifications = [
        { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services · 2023', icon: <ShieldCheck size={20} className="text-slate-400" /> },
        { title: 'Meta Front-End Developer', issuer: 'Coursera · 2022', icon: <Award size={20} className="text-slate-400" /> },
    ]

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-5 tracking-tight">Certifications</h3>
            <div className="space-y-6">
                {certifications.map(cert => (
                    <div key={cert.title} className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            {cert.icon}
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-slate-900 leading-tight">{cert.title}</p>
                            <p className="text-[12px] text-slate-500 mt-1 font-medium">{cert.issuer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
