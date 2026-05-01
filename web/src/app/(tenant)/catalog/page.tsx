import { createClient } from '@/utils/supabase/server'
import CatalogClient from './CatalogClient'
export default async function CatalogPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: customer } = await supabase
        .from('customers')
        .select('cust_id')
        .eq('auth_id', user!.id)
        .single()

    if (!customer) {
        return (
            <div className="flex items-center justify-center min-h-screen p-8 text-center text-zinc-400 bg-zinc-950">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Incomplete</h2>
                    <p className="mb-6">We couldn't find a tenant profile associated with your account. This happens if you created an account before the dashboard was finalized.</p>
                    <form action={async () => {
                        'use server'
                        const supa = await createClient()
                        const { data: { user } } = await supa.auth.getUser()
                        if (!user) return

                        const generateCustId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString()
                        await supa.from('customers').insert({
                            cust_id: generateCustId(),
                            auth_id: user.id,
                            name: user.email?.split('@')[0] || 'New Company',
                            email: user.email,
                            phone: 'Not Provided',
                            address: 'Not Provided'
                        })

                        // Refresh page
                        const { redirect } = await import('next/navigation')
                        redirect('/catalog')
                    }}>
                        <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                            Self-Heal: Generate Profile
                        </button>
                    </form>
                    <p className="mt-4 text-xs text-zinc-500">Clicking this will generate your unique CustID and unlock the catalog.</p>
                </div>
            </div>
        )
    }

    const { data: modules } = await supabase.from('modules').select('*')

    // Find which ones we already own or requested
    const { data: myModules } = await supabase.from('customer_modules').select('module_id, is_active').eq('cust_id', customer.cust_id)
    const { data: myOrders } = await supabase.from('orders').select('module_id').eq('cust_id', customer.cust_id).eq('status', 'pending')

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">Module Catalog</h1>
                <p className="text-zinc-400 text-lg">Purchase SCM modules to expand your platform capabilities.</p>
            </div>

            <CatalogClient
                modules={modules || []}
                myModules={myModules || []}
                myOrders={myOrders || []}
                custId={customer.cust_id}
            />
        </div>
    )
}
