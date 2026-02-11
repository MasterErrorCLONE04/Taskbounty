import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/Avatar"
import { ChevronDown, User, Settings, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface UserMenuDropdownProps {
    user: any
}

export function UserMenuDropdown({ user }: UserMenuDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    if (!user) return null

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(!isOpen)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    // Get user details (support both DB Profile and Auth User structure)
    const avatarUrl = user.avatar_url || user.user_metadata?.avatar_url
    const name = user.full_name || user.name || user.user_metadata?.name || 'User'
    const email = user.email || (user.user_metadata?.email) // Auth User has email at top level usually

    // Get user initials for fallback
    const initials = name
        ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U'

    return (
        <div className="relative h-full flex items-center" ref={dropdownRef}>
            <div
                className="flex flex-col items-center justify-center min-w-[72px] h-full text-slate-500 cursor-pointer border-l border-slate-100 ml-2 group hover:bg-slate-50/50 transition-colors"
                onClick={toggleDropdown}
            >
                <Avatar
                    src={avatarUrl}
                    fallback={initials}
                    className="w-8 h-8 border border-slate-200"
                />
                <div className={`flex items-center text-[11px] mt-0.5 font-medium group-hover:text-slate-900 transition-colors ${isOpen ? 'text-slate-900' : ''}`}>
                    Me <ChevronDown size={14} className={`ml-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%-8px)] right-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate">
                            {name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {email}
                        </p>
                    </div>

                    <div className="px-1">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/profile')
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <User size={16} />
                            Profile
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg flex items-center gap-2 transition-colors">
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>

                    <div className="h-px bg-slate-50 my-1 mx-1" />

                    <div className="px-1">
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors font-medium"
                        >
                            <LogOut size={16} />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
