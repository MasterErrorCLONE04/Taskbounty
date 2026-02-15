import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WithdrawalConfig } from '@/components/finance/WithdrawalConfig'
import { TopNavbar } from '@/components/layout/TopNavbar'

import { getProfile } from '@/actions/profile'
import { WalletSidebar } from '@/components/finance/WalletSidebar'
import { TransactionHistory } from '@/components/finance/TransactionHistory'

export default async function WithdrawalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/?login=true')

    // Fetch Profile
    const profile = await getProfile(user.id)

    // Fetch Balance
    const { data: balanceData } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Fetch Stripe Connect ID
    const { data: userData } = await supabase
        .from('users')
        .select('stripe_connect_id, email')
        .eq('id', user.id)
        .single()

    // Fetch recent withdrawals
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const availableBalance = balanceData?.available_balance || 0
    const stripeConnectId = userData?.stripe_connect_id

    return (
        <div className="h-screen bg-slate-50/50 flex flex-col overflow-hidden">
            <TopNavbar user={profile || user} />

            <div className="flex-1 overflow-hidden">
                <main className="h-full flex flex-col max-w-7xl mx-auto w-full">

                    <div className="flex-1 flex overflow-hidden bg-white rounded-3xl my-6 mx-6 border border-slate-100 shadow-sm relative">

                        {/* Wallet Navigation Sidebar */}
                        <div className="hidden lg:block border-r border-slate-100 p-8 bg-white overflow-y-auto w-80 shrink-0">
                            <div className="mb-10 px-2">
                                <h2 className="font-black text-slate-900 text-2xl tracking-tight mb-2">Wallet</h2>
                                <p className="text-slate-500 text-sm font-medium">Manage your finances</p>
                            </div>
                            <WalletSidebar />
                        </div>

                        {/* Config Area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                            <WithdrawalConfig
                                availableBalance={availableBalance}
                                stripeConnectId={stripeConnectId}
                                userEmail={userData?.email || user.email}
                            />
                        </div>

                        {/* Right Sidebar - History */}
                        <TransactionHistory transactions={withdrawals || []} />
                    </div>
                </main>
            </div>
        </div>
    )
}
