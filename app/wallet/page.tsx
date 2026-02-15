
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

    // Prepare Chart Data (Mocking reasonable distribution for now based on completedTasks if we had timestamps)
    // For V1, we'll map actual completed tasks to months if available, or show mock data if empty to look good
    const chartData = [
        { month: 'JUN', amount: 0 },
        { month: 'JUL', amount: 0 },
        { month: 'AUG', amount: 0 },
        { month: 'SEP', amount: 0 },
        { month: 'OCT', amount: 0 },
        { month: 'NOV', amount: 0 },
    ]

    // Basic aggregation if we have dates
    if (completedTasks && completedTasks.length > 0) {
        // This is a naive implementation, ideally done in SQL
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
    // For MVP mainly showing withdrawals as activity
    const activities = (withdrawals || []).map(w => ({
        id: w.id,
        type: 'WITHDRAWAL' as const,
        title: 'Withdrawal to Stripe',
        date: w.created_at,
        amount: w.amount,
        status: w.status
    }))

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
                                    <span className="text-xl font-black text-slate-400">USDC</span>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button className="bg-[#0095ff] hover:bg-[#0080db] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                        Deposit
                                    </button>
                                    <Link href="/wallet/withdraw" className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 px-8 py-3 rounded-xl font-bold transition-all active:scale-95">
                                        Withdraw
                                    </Link>
                                </div>
                            </div>

                            <StatsCards
                                totalEarned={totalEarned}
                                inEscrow={inEscrow}
                                bountiesDone={bountiesDone}
                            />

                            <h3 className="font-black text-slate-900 text-lg mb-6">Earnings History</h3>
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
