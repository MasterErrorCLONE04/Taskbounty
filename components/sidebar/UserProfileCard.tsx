
export function UserProfileCard({ user }: { user: any }) {
    if (!user) return null

    // Use actual user data or fallbacks
    const bannerUrl = user.banner_url || user.user_metadata?.banner_url || "https://picsum.photos/seed/bg/400/150"
    const avatarUrl = user.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.name || user.user_metadata?.name || 'User'}&background=random&size=150`
    const name = user.name || user.user_metadata?.name || user.email?.split('@')[0] || "Guest"
    const handle = `@${user.email?.split('@')[0] || 'guest'}`
    const bio = user.bio || user.user_metadata?.bio || "No bio yet."

    // Stats (Mocked or Real if available in DB eventually)
    // For now we use what we have in schema or defaults
    const stats = {
        viewers: 0, // Not tracked yet
        earnings: "0.00", // Not summed yet
        reputation: user.rating || 0
    }

    return (
        <div className="border-b border-slate-100 pb-6 mb-6">
            <div className="relative mb-12">
                <div className="h-24 bg-slate-200 rounded-xl overflow-hidden">
                    <img src={bannerUrl} className="w-full h-full object-cover opacity-80" alt="Banner" />
                </div>
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10 left-4 shadow-sm"
                />
            </div>
            <div className="px-1">
                <h2 className="text-xl font-bold hover:text-blue-500 cursor-pointer transition-colors text-slate-900 truncate">{name}</h2>
                <p className="text-sm text-slate-500 truncate">{handle}</p>
                <p className="text-[14px] mt-3 leading-snug text-slate-700 line-clamp-3">{bio}</p>
                <p className="text-[14px] font-bold text-blue-500 mt-2 flex items-center gap-1">
                    Reputation: {stats.reputation} <span className="text-yellow-400">★</span>
                </p>
            </div>

            {/* Profile Stats */}
            <div className="mt-5 space-y-3 px-1">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Profile viewers</span>
                    <span className="text-blue-500 font-bold">{stats.viewers}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Bounty earnings</span>
                    <span className="text-blue-500 font-bold">${stats.earnings}</span>
                </div>
            </div>
        </div>
    )
}
