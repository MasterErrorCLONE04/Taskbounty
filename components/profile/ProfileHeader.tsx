
import { BadgeCheck, MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/Button"

interface ProfileHeaderProps {
    user: any
    onEdit: () => void
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
    return (
        <div className="relative mb-20">
            {/* Banner */}
            <div className="h-48 md:h-64 bg-slate-200 w-full overflow-hidden">
                <img
                    src={user?.banner_url || "https://picsum.photos/seed/profile-banner/1200/400"}
                    className="w-full h-full object-cover"
                    alt="Profile Banner"
                />
            </div>

            {/* Avatar */}
            <div className="absolute -bottom-16 left-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                    <img
                        src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&size=300`}
                        className="w-full h-full object-cover"
                        alt={user?.name}
                    />
                </div>
            </div>

            {/* Edit Button */}
            <div className="absolute -bottom-12 right-6">
                <Button
                    onClick={onEdit}
                    variant="outline"
                    className="rounded-full font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                    Edit profile
                </Button>
            </div>
        </div>
    )
}
