"use client"

import { Briefcase, GraduationCap, Github, Linkedin, Globe } from 'lucide-react'

interface ExperienceItem {
    role: string
    company: string
    duration: string
    description: string
    type?: string
    logo_url?: string
}

interface EducationItem {
    school: string
    degree: string
    duration: string
    logo_url?: string
}

interface AboutTabProps {
    user: any
}

export function AboutTab({ user }: AboutTabProps) {
    const experience: ExperienceItem[] = Array.isArray(user?.experience) ? user.experience : []
    const education: EducationItem[] = Array.isArray(user?.education) ? user.education : []

    const getWebsiteUrl = (url: string) => {
        if (!url) return ''
        return url.startsWith('http') ? url : `https://${url}`
    }

    const getWebsiteDisplay = (url: string) => {
        try {
            return new URL(getWebsiteUrl(url)).hostname.replace('www.', '')
        } catch {
            return url
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
            {/* Summary */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                    {user?.summary ? (
                        user.summary.split('\n\n').map((paragraph: string, index: number) => (
                            <p key={index}>{paragraph}</p>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No summary added yet.</p>
                    )}
                </div>
            </section>

            {/* Experience */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                <div className="space-y-8">
                    {experience.length > 0 ? (
                        experience.map((exp, index) => {
                            const bullets = exp.description ? exp.description.split('\n').filter(line => line.trim() !== '') : []
                            return (
                                <div key={index} className="flex gap-4">
                                    {/* Logo */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                        {exp.logo_url ? (
                                            <img src={exp.logo_url} alt={exp.company} className="w-full h-full object-cover" />
                                        ) : (
                                            <Briefcase className="text-gray-400" size={20} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900">{exp.role}</h3>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-0.5">
                                            <span>{exp.company}</span>
                                            {exp.type && (
                                                <>
                                                    <span>•</span>
                                                    <span>{exp.type}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {exp.duration}
                                        </div>
                                        {bullets.length > 0 && (
                                            <ul className="mt-4 space-y-2.5">
                                                {bullets.map((bullet, idx) => (
                                                    <li key={idx} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                                                        <span>{bullet.replace(/^[•\-]\s*/, '')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-gray-400 italic">No experience added.</p>
                    )}
                </div>
            </section>

            {/* Education */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                <div className="space-y-6">
                    {education.length > 0 ? (
                        education.map((edu, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                    {edu.logo_url ? (
                                        <img src={edu.logo_url} alt={edu.school} className="w-full h-full object-cover" />
                                    ) : (
                                        <GraduationCap className="text-gray-400" size={24} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">{edu.school}</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">{edu.degree}</p>
                                    <p className="text-xs text-gray-500 mt-1">{edu.duration}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No education added.</p>
                    )}
                </div>
            </section>

            {/* Links */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.social_links?.github && (
                        <LinkCard
                            icon={<Github className="w-5 h-5 text-gray-700" />}
                            label="GitHub"
                            value={getWebsiteDisplay(user.social_links.github)}
                            href={getWebsiteUrl(user.social_links.github)}
                        />
                    )}
                    {user?.social_links?.linkedin && (
                        <LinkCard
                            icon={<Linkedin className="w-5 h-5 text-blue-600" />}
                            label="LinkedIn"
                            value={getWebsiteDisplay(user.social_links.linkedin)}
                            href={getWebsiteUrl(user.social_links.linkedin)}
                        />
                    )}
                    {user?.website && (
                        <LinkCard
                            icon={<Globe className="w-5 h-5 text-gray-500" />}
                            label="Website"
                            value={getWebsiteDisplay(user.website)}
                            href={getWebsiteUrl(user.website)}
                        />
                    )}
                    {(!user?.website && !user?.social_links?.github && !user?.social_links?.linkedin) && (
                        <p className="text-gray-400 italic">No links added.</p>
                    )}
                </div>
            </section>
        </div>
    )
}

const LinkCard: React.FC<{ icon: React.ReactNode; label: string; value: string; href: string }> = ({ icon, label, value, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
    >
        <div className="bg-gray-50 p-2.5 rounded-lg">{icon}</div>
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-blue-600 truncate max-w-[200px]">{value}</p>
        </div>
    </a>
)