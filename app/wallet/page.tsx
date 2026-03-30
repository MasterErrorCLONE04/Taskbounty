
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { getProfile } from '@/actions/profile'
import { WalletSidebar } from '@/components/finance/WalletSidebar'
import { StatsCards } from '@/components/finance/StatsCards'
import { EarningsChart } from '@/components/finance/EarningsChart'
import { ActivityList } from '@/components/finance/ActivityList'
import { RightSidebarWallet } from '@/components/finance/RightSidebarWallet'
import Link from 'next/link'
import { Wallet, ArrowDown } from 'lucide-react'

// Helper to format currency for chart
const formatMonth = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

export default async function WalletPage() {
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

    // Fetch Stripe Connect
    const { data: userData } = await supabase
        .from('users')
        .select('stripe_connect_id, email')
        .eq('id', user.id)
        .single()

    // Fetch Tasks for Stats (Completed = Earned)
    const { data: completedTasks } = await supabase
        .from('tasks')
        .select('bounty_amount, updated_at')
        .eq('assigned_worker_id', user.id)
        .eq('status', 'COMPLETED')

    // Fetch Active Tasks (In Escrow)
    const { data: activeTasks } = await supabase
        .from('tasks')
        .select('bounty_amount')
        .eq('assigned_worker_id', user.id)
        .in('status', ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'DISPUTED'])

    // Fetch Withdrawals
    const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Calculate Stats
    const totalEarned = completedTasks?.reduce((acc, curr) => acc + Number(curr.bounty_amount), 0) || 0
    const inEscrow = activeTasks?.reduce((acc, curr) => acc + Number(curr.bounty_amount), 0) || 0
    const bountiesDone = completedTasks?.length || 0

    const availableBalance = balanceData?.available_balance || 0

    // Generate last 6 months dynamically for Earnings Chart
    const getPast6Months = () => {
        const result = []
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setDate(1) // Imprescindible para evitar el bug del día 31 que salta a marzo dos veces
            d.setMonth(d.getMonth() - i)
            const monthShort = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            result.push({ month: monthShort, amount: 0 })
        }
        return result
    }

    const chartData = getPast6Months()

    // Basic aggregation for chart
    if (completedTasks && completedTasks.length > 0) {
        completedTasks.forEach(task => {
            const date = new Date(task.updated_at)
            const monthShort = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            const existing = chartData.find(d => d.month === monthShort)
            if (existing) {
                existing.amount += Number(task.bounty_amount)
            }
        })
    }

    // Merge Activity (Withdrawals + Recent Earnings)
    const withdrawalActivities = (withdrawals || []).map(w => ({
        id: w.id,
        type: 'WITHDRAWAL' as const,
        title: 'Withdrawal to Bank/Stripe',
        date: w.created_at,
        amount: w.amount,
        status: w.status
    }))

    const earningActivities = (completedTasks || []).map((t, index) => ({
        id: `earn-${index}`,
        type: 'PAYMENT' as const,
        title: 'Bounty Earned',
        date: t.updated_at,
        amount: Number(t.bounty_amount),
        status: 'COMPLETED' as const
    }))

    const activities = [...withdrawalActivities, ...earningActivities]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10) // Show up to 10 latest activities

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

                        {/* Main Dashboard Area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-white p-8 lg:p-12">
                            <h2 className="font-black text-slate-900 text-xl mb-8">Wallet Overview</h2>

                            {/* Balance Card */}
                            <div className="bg-slate-50 rounded-[2rem] p-10 text-center mb-10 border border-slate-100">
                                <p className="text-slate-500 font-medium mb-4">Total Balance</p>
                                <div className="flex items-baseline justify-center gap-2 mb-8">
                                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                                        ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-xl font-black text-slate-400">USD</span>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Link href="/wallet/withdraw" className="bg-[#0095ff] hover:bg-[#0080db] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                        Withdraw
                                    </Link>
                                </div>
                            </div>

                            <StatsCards
                                totalEarned={totalEarned}
                                inEscrow={inEscrow}
                                bountiesDone={bountiesDone}
                            />

                            <EarningsChart data={chartData} />

                            <ActivityList activities={activities} />
                        </div>

                        {/* Right Sidebar - Wallet Details */}
                        <RightSidebarWallet
                            stripeConnectId={userData?.stripe_connect_id}
                            userEmail={userData?.email || user.email}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}
