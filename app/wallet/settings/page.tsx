
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { getProfile } from '@/actions/profile'
import { WalletSidebar } from '@/components/finance/WalletSidebar'
import { SecurityTips } from '@/components/finance/SecurityTips'
import { PaymentMethodsList } from '@/components/finance/PaymentMethodsList'
import { PaymentPreferences } from '@/components/finance/PaymentPreferences'
import { TaxInfoCard } from '@/components/finance/TaxInfoCard'

export default async function PaymentSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/?login=true')

    // Fetch Profile
    const profile = await getProfile(user.id)

    // Fetch Stripe Connect Data
    const { data: userData } = await supabase
        .from('users')
        .select('stripe_connect_id, email')
        .eq('id', user.id)
        .single()

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

                        {/* Main Settings Area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-white p-8 lg:p-12">
                            <h2 className="font-black text-slate-900 text-xl mb-8">Payment Settings</h2>

                            <PaymentMethodsList
                                stripeConnectId={userData?.stripe_connect_id}
                                userEmail={userData?.email || user.email}
                            />

                            <PaymentPreferences />

                            <TaxInfoCard />
                        </div>

                        {/* Right Sidebar - Security Tips */}
                        <SecurityTips />
                    </div>
                </main>
            </div>
        </div>
    )
}
