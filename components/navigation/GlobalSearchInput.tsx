"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { searchUsers } from "@/actions/profile"

export function GlobalSearchInput() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    // Debounce logic inline
    const [debouncedQuery, setDebouncedQuery] = useState(query)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(query), 300)
        return () => clearTimeout(handler)
    }, [query])

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const users = await searchUsers(debouncedQuery)
                setResults(users || [])
                setIsOpen(true)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (userId: string) => {
        setIsOpen(false)
        setQuery("")
        router.push(`/profile/${userId}`)
    }

    return (
        <div ref={searchRef} className="relative w-full max-w-xs group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
                placeholder="Search Users"
                className="w-full bg-slate-100 border-none rounded-full py-1.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-500 outline-none"
            />
            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-slate-400" size={16} />
                </div>
            )}

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 z-50">
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Users</div>
                    {results.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelect(user.id)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <img
                                src={user.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[180px]">{user.bio || 'No bio'}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 text-center z-50">
                    <p className="text-sm text-slate-500">No users found.</p>
                </div>
            )}
        </div>
    )
}
