import { createClient } from '@/utils/supabase/server'
import AdminDashboard from '@/app/components/AdminDashboard'

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { count: customersCount } = await supabase.from('customers').select('*', { count: 'exact', head: true })
    const { count: productsSold } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'approved')
    const { count: servicesUsed } = await supabase.from('customer_modules').select('*', { count: 'exact', head: true }).eq('is_active', true)

    return <AdminDashboard
        email={user!.email!}
        stats={{
            customers: customersCount || 0,
            productsSold: productsSold || 0,
            servicesUsed: servicesUsed || 0
        }}
    />
}
