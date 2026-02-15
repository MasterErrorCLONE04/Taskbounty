
import { Shield, Key, CheckCircle, HelpCircle, BookOpen, Lock } from 'lucide-react'
import Link from 'next/link'

export function SecurityTips() {
    return (
        <div className="w-full lg:w-80 shrink-0 border-l border-slate-100 bg-white h-full overflow-y-auto hidden xl:block p-8">
            {/* Security Tips */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-10">
                <h3 className="font-black text-slate-900 text-lg mb-6">Security Tips</h3>

                <div className="space-y-6">
                    <div className="flex gap-3">
                        <Key className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-slate-900 text-sm mb-1">Protect private keys.</p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Never share your seed phrase or private keys with anyone, including TaskBounty staff.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-slate-900 text-sm mb-1">Verify domains.</p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Ensure you are on taskbounty.com before connecting your wallet.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-slate-900 text-sm mb-1">Hardware wallets.</p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                For large balances, we recommend using a hardware wallet for maximum security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Support */}
            <div>
                <h3 className="font-black text-slate-900 text-lg mb-6">Wallet Support</h3>

                <div className="space-y-6">
                    <Link href="#" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                        </div>
                        Help Center
                    </Link>
                    <Link href="#" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                        </div>
                        Connecting a Wallet Guide
                    </Link>
                    <Link href="#" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Lock className="w-4 h-4 text-blue-500" />
                        </div>
                        Security Policy
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
