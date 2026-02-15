
import { Wallet, FileText, BarChart2, HelpCircle, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface RightSidebarWalletProps {
    stripeConnectId: string | null
    userEmail: string
}

export function RightSidebarWallet({ stripeConnectId, userEmail }: RightSidebarWalletProps) {
    return (
        <div className="w-full lg:w-80 shrink-0 border-l border-slate-100 bg-white h-full overflow-y-auto hidden xl:block p-8">
            {/* My Wallets */}
            <div className="mb-10">
                <h3 className="font-black text-slate-900 text-lg mb-6">My Wallets</h3>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {/* Placeholder for Stripe/Bank Icon */}
                        <Wallet className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">Stripe Connect</p>
                        <p className="text-xs text-slate-500 truncate">
                            {stripeConnectId ? 'Connected' : 'Not Connected'}
                        </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${stripeConnectId ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>

                <button className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    <Plus className="w-3 h-3" />
                    Add another wallet
                </button>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="font-black text-slate-900 text-lg mb-6">Quick Actions</h3>

                <div className="space-y-4">
                    <Link href="#" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        View Tax Forms
                    </Link>
                    <Link href="#" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        Transaction Report
                    </Link>
                    <Link href="/help" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        Wallet Help
                    </Link>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-100">
                <div className="flex gap-3 text-[11px] text-slate-400 font-medium">
                    <a href="#" className="hover:text-slate-600">Terms</a>
                    <a href="#" className="hover:text-slate-600">Privacy</a>
                    <a href="#" className="hover:text-slate-600">Help</a>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                    © 2024 TaskBounty Corp.
                </p>
            </div>
        </div>
    )
}
