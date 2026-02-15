
import { Wallet, Plus, Terminal } from 'lucide-react'

interface PaymentMethodsListProps {
    stripeConnectId: string | null
    userEmail?: string
}

export function PaymentMethodsList({ stripeConnectId, userEmail }: PaymentMethodsListProps) {
    return (
        <div className="mb-10">
            <h3 className="font-black text-slate-900 text-lg mb-6">Connected Wallets</h3>

            <div className="space-y-4">
                {/* MetaMask - Mocked for visual fidelity to mockup */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                            {/* Placeholder for MetaMask Logo */}
                            <div className="w-6 h-6 bg-orange-500 rounded-full" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-[15px]">MetaMask</p>
                            <p className="text-xs text-slate-500 font-medium">0x71C...4e9 (Main)</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
                        Disconnect
                    </button>
                </div>

                {/* Stripe / Web3 Wallet Mock */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-[15px]">Stripe Connect</p>
                            <p className="text-xs text-slate-500 font-medium">
                                {stripeConnectId ? 'Connected' : 'Not Connected'}
                            </p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
                        Disconnect
                    </button>
                </div>
            </div>

            <button className="w-full mt-4 bg-white border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-blue-500 rounded-2xl p-4 flex items-center justify-center gap-2 font-bold transition-all text-sm">
                <Plus className="w-5 h-5" />
                Add new wallet
            </button>
        </div>
    )
}
