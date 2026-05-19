'use client'
import { useState, useEffect } from 'react'
import { approveModuleAccess } from './actions'
import { createClient } from '@/utils/supabase/client'
import { ORDER_STATUS, OrderStatus } from '@/lib/constants'

export default function AdminDashboard({ email, stats }: { email: string, stats: { customers: number, productsSold: number, servicesUsed: number } }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'manage'>('overview')
    const [orderTab, setOrderTab] = useState<'pending' | 'active'>(ORDER_STATUS.PENDING)
    const [searchQuery, setSearchQuery] = useState('')

    const [pendingOrders, setPendingOrders] = useState<any[]>([])
    const [activeOrders, setActiveOrders] = useState<any[]>([])

    // New: Handle Decline Flow
    const [declineModalOpen, setDeclineModalOpen] = useState<any>(null)
    const [declineReason, setDeclineReason] = useState('')

    // New: List of all customers
    const [allCustomers, setAllCustomers] = useState<any[]>([])

    // The currently selected customer for the modal
    const [searchResult, setSearchResult] = useState<any>(null)
    const [allModules, setAllModules] = useState<any[]>([])
    const [customerModules, setCustomerModules] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const tab = params.get('tab')
        if (tab === 'orders') setActiveTab('notifications')
        else if (tab === 'manage') setActiveTab('manage')
        else setActiveTab('overview')
    }, [])

    useEffect(() => {
        // Load pending and active orders
        const loadOrders = async () => {
            const { data: pendingData } = await supabase
                .from('orders')
                .select(`id, cust_id, status, created_at, modules (id, name)`)
                .eq('status', ORDER_STATUS.PENDING)
                .order('created_at', { ascending: false })

            if (pendingData) setPendingOrders(pendingData)

            const { data: activeData } = await supabase
                .from('orders')
                .select(`id, cust_id, status, created_at, modules (id, name)`)
                .eq('status', ORDER_STATUS.APPROVED)
                .order('created_at', { ascending: false })

            if (activeData) setActiveOrders(activeData)

            const { data: mods } = await supabase.from('modules').select('*')
            if (mods) setAllModules(mods)

            const { data: customers } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
            if (customers) setAllCustomers(customers)
        }
        loadOrders()
    }, [supabase])

    const openCustomerModal = async (cust_id: string) => {
        // 1. Find customer
        const { data: customer } = await supabase
            .from('customers')
            .select('*')
            .eq('cust_id', cust_id)
            .maybeSingle()

        if (customer) {
            setSearchResult(customer)

            // 2. Find their active modules
            const { data: custMods } = await supabase
                .from('customer_modules')
                .select('*')
                .eq('cust_id', cust_id)

            setCustomerModules(custMods || [])
        } else {
            setSearchResult(null)
            alert('Customer ID not found')
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery) return
        await openCustomerModal(searchQuery)
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-6xl mx-auto mt-10">
                <header className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-400">Admin Portal</h1>
                        <p className="text-zinc-400">Logged in as {email}</p>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg font-medium">
                            Sign Out
                        </button>
                    </form>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Platform Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'notifications' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Order Book ({pendingOrders.length + activeOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'manage' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Customer Search & Feature Toggles
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-emerald-400 mb-6">System Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <p className="text-zinc-400 text-sm font-medium mb-1">Total Active Tenants</p>
                                <p className="text-4xl font-black">{stats.customers}</p>
                            </div>
                            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <p className="text-zinc-400 text-sm font-medium mb-1">Total Products Sold</p>
                                <p className="text-4xl font-black">{stats.productsSold}</p>
                            </div>
                            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <p className="text-zinc-400 text-sm font-medium mb-1">Total Services Used</p>
                                <p className="text-4xl font-black tracking-tight">{stats.servicesUsed}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Order Book</h2>

                        <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-4">
                            <button
                                onClick={() => setOrderTab('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${orderTab === 'pending' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Pending Provision ({pendingOrders.length})
                            </button>
                            <button
                                onClick={() => setOrderTab('active')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${orderTab === 'active' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Active Orders ({activeOrders.length})
                            </button>
                        </div>

                        {orderTab === 'pending' && (
                            <div>
                                {pendingOrders.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-8">No pending module requests.</p>
                                ) : (
                                    <div className="grid gap-4">
                                        {pendingOrders.map(order => (
                                            <div key={order.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-blue-400">CustID: <span className="font-mono bg-zinc-950 px-2 py-0.5 rounded">{order.cust_id}</span></p>
                                                    <p className="text-sm text-zinc-400">Requested <strong>{order.modules?.name}</strong> module.</p>
                                                </div>
                                                <div className="flex gap-2 mt-4 md:mt-0">
                                                    <button
                                                        onClick={() => setDeclineModalOpen(order)}
                                                        className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold transition-all border border-zinc-700"
                                                    >
                                                        Decline
                                                    </button>
                                                    <form action={async (formData) => {
                                                        const res = await approveModuleAccess(formData)
                                                        if (res && res.success && res.status === ORDER_STATUS.APPROVED) {
                                                            setPendingOrders(prev => prev.filter(o => o.id !== res.orderId))
                                                            setActiveOrders(prev => [{ ...order, status: ORDER_STATUS.APPROVED }, ...prev])
                                                        }
                                                    }}>
                                                        <input type="hidden" name="custId" value={order.cust_id} />
                                                        <input type="hidden" name="moduleId" value={order.modules?.id} />
                                                        <input type="hidden" name="orderId" value={order.id} />
                                                        <input type="hidden" name="grantAccess" value="true" />
                                                        <button className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold shadow-lg transition-all text-white">
                                                            Approve Access Let's Go
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {orderTab === 'active' && (
                            <div>
                                {activeOrders.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-8">No active orders to display.</p>
                                ) : (
                                    <div className="grid gap-4">
                                        {activeOrders.map(order => (
                                            <div key={order.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center opacity-70">
                                                <div>
                                                    <p className="font-semibold text-zinc-300">CustID: <span className="font-mono bg-zinc-950 px-2 py-0.5 rounded text-white">{order.cust_id}</span></p>
                                                    <p className="text-sm text-zinc-500">Purchased <strong>{order.modules?.name}</strong> module.</p>
                                                </div>
                                                <div>
                                                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20 rounded-lg">
                                                        ACTIVATED
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'manage' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 50% Section: Search & Customer List */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                            <h2 className="text-xl font-bold mb-4 text-purple-400">Tenant Directory</h2>

                            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                                <input
                                    type="text"
                                    placeholder="Search by 10-digit CustID"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-blue-500 outline-none text-white font-mono text-sm"
                                />
                                <button type="submit" className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm">
                                    Search
                                </button>
                            </form>

                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {allCustomers.length === 0 ? (
                                    <p className="text-zinc-500 text-sm text-center py-4">No customers found.</p>
                                ) : (
                                    allCustomers.filter(c => c.cust_id.includes(searchQuery) || c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(customer => (
                                        <button
                                            key={customer.cust_id}
                                            onClick={() => openCustomerModal(customer.cust_id)}
                                            className="w-full text-left p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all group flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{customer.name}</p>
                                                <p className="text-xs text-zinc-500 font-mono mt-1">ID: {customer.cust_id}</p>
                                            </div>
                                            <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Manage &rarr;
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Filler for the other 50% if no modal is open (optional, keeps layout stable) */}
                        <div className="hidden md:flex items-center justify-center border border-zinc-800/50 bg-zinc-900/10 rounded-3xl border-dashed">
                            <p className="text-zinc-600 text-sm">Select a customer to view their active status.</p>
                        </div>
                    </div>
                )}

                {/* Glassmorphism Modal for Customer Details */}
                {searchResult && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop overlay */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSearchResult(null)}
                        ></div>

                        {/* Modal Content */}
                        <div className="relative w-full max-w-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">

                            {/* Header with Red Cross */}
                            <div className="flex justify-between items-center p-6 border-b border-zinc-700/50 bg-zinc-800/30">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{searchResult.name}</h3>
                                    <p className="text-zinc-400 font-mono text-sm mt-1">CustID: {searchResult.cust_id} &bull; {searchResult.email}</p>
                                </div>
                                <button
                                    onClick={() => setSearchResult(null)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors flex items-center justify-center group"
                                    title="Close"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body (Module Toggles) */}
                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Current Active Status</h4>

                                <div className="space-y-3">
                                    {allModules.map(mod => {
                                        const hasAccess = customerModules.find(cm => cm.module_id === mod.id && cm.is_active)

                                        return (
                                            <div key={mod.id} className="flex justify-between items-center p-4 bg-zinc-950/50 rounded-xl border border-zinc-700/30">
                                                <div>
                                                    <p className="font-medium text-lg text-zinc-200">{mod.name}</p>
                                                    <p className="text-xs text-zinc-500">{mod.description}</p>
                                                </div>

                                                <form action={approveModuleAccess as any} className="flex items-center ml-4">
                                                    <input type="hidden" name="custId" value={searchResult.cust_id} />
                                                    <input type="hidden" name="moduleId" value={mod.id} />
                                                    <input type="hidden" name="grantAccess" value={hasAccess ? "false" : "true"} />

                                                    <button type="submit" className="relative inline-flex items-center cursor-pointer group">
                                                        <div className={`w-12 h-6 rounded-full transition-all shadow-inner ${hasAccess ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                                                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all shadow-sm ${hasAccess ? 'translate-x-6' : ''}`}></div>
                                                        </div>
                                                    </button>
                                                </form>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Decline Reason Modal */}
            {declineModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeclineModalOpen(null)}></div>
                    <div className="relative w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-zinc-700/50 bg-zinc-800/30">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Decline Module Request</h3>
                                <p className="text-zinc-400 text-sm mt-1">Tenant: <span className="font-mono">{declineModalOpen.cust_id}</span></p>
                            </div>
                            <button
                                onClick={() => setDeclineModalOpen(null)}
                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form action={async (formData) => {
                            const res = await approveModuleAccess(formData)
                            if (res && res.success) {
                                setPendingOrders(prev => prev.filter(o => o.id !== res.orderId))
                                setDeclineModalOpen(null)
                                setDeclineReason('')
                            }
                        }} className="p-6">
                            <input type="hidden" name="custId" value={declineModalOpen.cust_id} />
                            <input type="hidden" name="moduleId" value={declineModalOpen.modules?.id} />
                            <input type="hidden" name="orderId" value={declineModalOpen.id} />
                            <input type="hidden" name="decline" value="true" />

                            <label className="block text-sm font-bold text-zinc-300 mb-2">Reason for Decline</label>
                            <textarea
                                name="declineReason"
                                required
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="Explain why this request is being rejected. This will be sent to the Supreme Admin for final verification..."
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors resize-none h-32 mb-6 text-sm"
                            ></textarea>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setDeclineModalOpen(null)} className="px-5 py-2.5 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors text-sm">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] rounded-xl font-bold hover:bg-red-500 transition-colors text-sm">Submit Decline Proposal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
