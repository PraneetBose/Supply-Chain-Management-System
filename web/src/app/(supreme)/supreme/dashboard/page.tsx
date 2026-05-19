import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SupremeDashboardClient from '../../components/SupremeDashboardClient'
import { ORDER_STATUS } from '@/lib/constants'

export default async function SupremeDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Verify Role
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user!.id).single()
    if (roleData?.role !== 'supreme_admin') redirect('/login')

    const { count: tenantCount } = await supabase.from('customers').select('*', { count: 'exact', head: true })
    const { count: productsSold } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', ORDER_STATUS.APPROVED)
    const { count: servicesUsed } = await supabase.from('customer_modules').select('*', { count: 'exact', head: true }).eq('is_active', true)

    // Fetch Pending Orders
    const { data: pendingOrders } = await supabase
        .from('orders')
        .select(`id, cust_id, status, created_at, modules (id, name)`)
        .eq('status', ORDER_STATUS.PENDING)
        .order('created_at', { ascending: false })

    // Fetch Pending Decline Orders (Req Tab)
    const { data: reqOrders } = await supabase
        .from('orders')
        .select(`id, cust_id, status, decline_reason, created_at, modules (id, name)`)
        .eq('status', ORDER_STATUS.PENDING_DECLINE)
        .order('created_at', { ascending: false })

    // Fetch Active (Approved) Orders
    const { data: activeOrders } = await supabase
        .from('orders')
        .select(`id, cust_id, status, created_at, modules (id, name)`)
        .eq('status', ORDER_STATUS.APPROVED)
        .order('created_at', { ascending: false })

    // Fetch all customers for Directory
    const { data: allCustomers } = await supabase
        .from('customers')
        .select('cust_id, name, email')
        .order('created_at', { ascending: false })
        .limit(100)

    // Fetch all catalog modules
    const { data: allModules } = await supabase
        .from('modules')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="p-8 lg:p-12 max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-purple-400">System Dashboard</h1>
                <p className="text-zinc-400 text-lg">Platform-wide overview and health metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <p className="text-zinc-400 text-sm font-medium mb-1">Total Active Tenants</p>
                    <p className="text-4xl font-black">{tenantCount || 0}</p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <p className="text-zinc-400 text-sm font-medium mb-1">Total Products Sold</p>
                    <p className="text-4xl font-black">{productsSold || 0}</p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <p className="text-zinc-400 text-sm font-medium mb-1">Total Services Used</p>
                    <p className="text-4xl font-black tracking-tight">{servicesUsed || 0}</p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <p className="text-zinc-400 text-sm font-medium mb-1">Platform Status</p>
                    <p className="text-4xl font-black text-emerald-400 tracking-tight">Healthy</p>
                </div>
            </div>

            <SupremeDashboardClient
                initialOrders={pendingOrders || []}
                activeOrders={activeOrders || []}
                reqOrders={reqOrders || []}
                allCustomers={allCustomers || []}
                allModules={allModules || []}
            />
        </div>
    )
}
