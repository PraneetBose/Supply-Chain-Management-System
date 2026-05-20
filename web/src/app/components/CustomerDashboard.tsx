'use client'
import { useState, useEffect } from 'react'
import { submitOrder } from './actions'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ORDER_STATUS } from '@/lib/constants'

export default function CustomerDashboard({ customer }: { customer: any }) {
    const [modules, setModules] = useState<any[]>([])
    const [activeModules, setActiveModules] = useState<any[]>([])
    const [pendingOrders, setPendingOrders] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const loadData = async () => {
            // 1. All available modules
            const { data: allMods } = await supabase.from('modules').select('*')
            if (allMods) setModules(allMods)

            // 2. Active modules for this customer
            const { data: active } = await supabase
                .from('customer_modules')
                .select('*, modules(*)')
                .eq('cust_id', customer.cust_id)
                .eq('is_active', true)
            if (active) setActiveModules(active)

            // 3. Pending module orders
            const { data: pending } = await supabase
                .from('orders')
                .select('*')
                .eq('cust_id', customer.cust_id)
                .in('status', [ORDER_STATUS.PENDING])
            if (pending) setPendingOrders(pending)
        }
        loadData()
    }, [customer.cust_id])

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-5xl mx-auto mt-10">
                <header className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Customer Portal</h1>
                        <p className="text-zinc-400 text-lg">Welcome back, {customer.name}</p>
                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm">
                            CustID: {customer.cust_id}
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors font-medium">Sign Out</button>
                    </form>
                </header>

                <h2 className="text-2xl font-bold mb-6">Your Active Modules</h2>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {activeModules.length === 0 ? (
                        <div className="col-span-full p-8 md:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl text-center border-dashed">
                            <p className="text-zinc-400 max-w-sm mx-auto">You haven't purchased any SCM modules yet. Browse the catalog below to request access.</p>
                        </div>
                    ) : (
                        activeModules.map(am => (
                            <div key={am.id} className="p-6 bg-emerald-950/20 border border-emerald-900/50 rounded-2xl flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-emerald-400">{am.modules?.name}</h3>
                                    <p className="text-zinc-400 text-sm mb-4">You have active access to this module.</p>
                                </div>
                                <button className="w-full py-2 bg-emerald-600/20 text-emerald-400 font-semibold rounded-lg">Launch Module &rarr;</button>
                            </div>
                        ))
                    )}
                </section>

                <h2 className="text-2xl font-bold mb-6">Module Catalog</h2>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map(mod => {
                        const isActive = activeModules.some(am => am.module_id === mod.id)
                        const isPending = pendingOrders.some(po => po.module_id === mod.id)

                        if (isActive) return null; // Don't show in catalog if already active

                        return (
                            <div key={mod.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between hover:border-blue-500/50 transition-colors">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{mod.name}</h3>
                                    <p className="text-zinc-400 text-sm mb-4">{mod.description || 'No description available for this module yet.'}</p>
                                </div>
                                {isPending ? (
                                    <button disabled className="w-full py-2 bg-zinc-800 text-yellow-500 border border-zinc-700 font-semibold rounded-lg text-center cursor-not-allowed">
                                        Order Pending Admin Approval...
                                    </button>
                                ) : (
                                    <Link
                                        href="/catalog"
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors block text-center"
                                    >
                                        Buy Now
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </section>
            </div>
        </div>
    )
}
