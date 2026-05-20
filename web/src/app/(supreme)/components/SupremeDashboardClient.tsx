'use client'

import { useState, useEffect } from 'react'
import { searchCustomerByCustId, changeUserRole, toggleModuleAccess, updateModulePrice } from './actions'
import { approveModuleAccess } from '@/app/components/actions'
import { ORDER_STATUS } from '@/lib/constants'

export default function SupremeDashboardClient({ initialOrders: serverInitialOrders, activeOrders: serverActiveOrders, reqOrders: serverReqOrders, allCustomers, allModules }: { initialOrders: any[], activeOrders: any[], reqOrders: any[], allCustomers: any[], allModules: any[] }) {
    const [activeTab, setActiveTab] = useState<'orders' | 'manage' | 'pricing'>('orders')
    const [orderTab, setOrderTab] = useState<'pending' | 'active' | 'req'>(ORDER_STATUS.PENDING)

    // Manage local order state for optimistic UI updates
    const [initialOrders, setInitialOrders] = useState(serverInitialOrders)
    const [activeOrders, setActiveOrders] = useState(serverActiveOrders)
    const [reqOrders, setReqOrders] = useState(serverReqOrders)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const tab = params.get('tab')
        if (tab === 'orders' || tab === 'manage' || tab === 'pricing') setActiveTab(tab)
    }, [])

    // Manage Search State
    const [searchId, setSearchId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [customer, setCustomer] = useState<any>(null)

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        await openCustomerModal(searchId)
    }

    async function openCustomerModal(custId: string) {
        if (!custId) return
        setLoading(true)
        setError('')
        setCustomer(null)

        const result = await searchCustomerByCustId(custId)

        if (result.error) {
            setError(result.error)
        } else {
            setCustomer(result.customer)
        }
        setLoading(false)
    }

    async function handleRoleChange(authId: string, newRole: 'customer' | 'admin' | 'supreme_admin') {
        const ok = confirm(`Are you sure you want to change this user's role to ${newRole}?`)
        if (!ok) return

        setLoading(true)
        const result = await changeUserRole(authId, newRole)
        if (result.error) {
            setError(result.error)
        } else {
            const refresh = await searchCustomerByCustId(searchId)
            if (refresh.customer) setCustomer(refresh.customer)
        }
        setLoading(false)
    }

    async function handlePriceUpdate(moduleId: string, newPrice: number) {
        if (newPrice < 0) return alert('Price cannot be negative')
        setLoading(true)
        const result = await updateModulePrice(moduleId, newPrice)
        if (result.error) {
            setError(result.error)
        } else {
            alert('Price updated successfully')
        }
        setLoading(false)
    }

    async function handleModuleToggle(moduleId: string, currentlyActive: boolean) {
        setLoading(true)
        const result = await toggleModuleAccess(customer.cust_id, moduleId, currentlyActive)
        if (result.error) {
            setError(result.error)
        } else {
            const refresh = await searchCustomerByCustId(searchId)
            if (refresh.customer) setCustomer(refresh.customer)
        }
        setLoading(false)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
            <div className="flex gap-4 mb-8 pb-6 border-b border-zinc-800">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'}`}
                >
                    Order Book ({initialOrders.length + activeOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'manage' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'}`}
                >
                    Customer Search & Feature Toggles
                </button>
                <button
                    onClick={() => setActiveTab('pricing')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'pricing' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'}`}
                >
                    Pricing Manager
                </button>
            </div>

            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-purple-400">Order Book</h2>

                    <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-4">
                        <button
                            onClick={() => setOrderTab('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${orderTab === 'pending' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Pending Provision ({initialOrders.length})
                        </button>
                        <button
                            onClick={() => setOrderTab('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${orderTab === 'active' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Active Orders ({activeOrders.length})
                        </button>
                        <button
                            onClick={() => setOrderTab('req')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${orderTab === 'req' ? 'bg-zinc-800 text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Req (Declines) ({reqOrders.length})
                        </button>
                    </div>

                    {orderTab === 'pending' && (
                        <div>
                            {initialOrders.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed">
                                    No pending module requests.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {initialOrders.map(order => (
                                        <div key={order.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex justify-between items-center transition-all hover:border-purple-500/30">
                                            <div>
                                                <p className="font-bold text-purple-400 mb-1">CustID: <span className="font-mono text-white text-lg">{order.cust_id}</span></p>
                                                <p className="text-zinc-400">Requested <strong className="text-zinc-200">{order.modules?.name}</strong> module.</p>
                                            </div>
                                            <div className="flex gap-2 mt-4 md:mt-0">
                                                <form action={async (formData) => {
                                                    const res = await approveModuleAccess(formData)
                                                    if (res && res.success) {
                                                        setInitialOrders(prev => prev.filter(o => o.id !== res.orderId))
                                                    }
                                                }}>
                                                    <input type="hidden" name="custId" value={order.cust_id} />
                                                    <input type="hidden" name="moduleId" value={order.modules?.id} />
                                                    <input type="hidden" name="orderId" value={order.id} />
                                                    <input type="hidden" name="decline" value="true" />
                                                    <button className="px-6 py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl transition-all h-full">
                                                        Decline
                                                    </button>
                                                </form>
                                                <form action={async (formData) => {
                                                    const res = await approveModuleAccess(formData)
                                                    if (res && res.success && res.status === ORDER_STATUS.APPROVED) {
                                                        setInitialOrders(prev => prev.filter(o => o.id !== res.orderId))
                                                        setActiveOrders(prev => [{ ...order, status: ORDER_STATUS.APPROVED }, ...prev])
                                                    }
                                                }}>
                                                    <input type="hidden" name="custId" value={order.cust_id} />
                                                    <input type="hidden" name="moduleId" value={order.modules?.id} />
                                                    <input type="hidden" name="orderId" value={order.id} />
                                                    <input type="hidden" name="grantAccess" value="true" />
                                                    <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(5,150,105,0.3)] transition-all">
                                                        Provision Access
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
                                <div className="p-8 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed">
                                    No active orders to display.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {activeOrders.map(order => (
                                        <div key={order.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex justify-between items-center opacity-80">
                                            <div>
                                                <p className="font-bold text-zinc-300 mb-1">CustID: <span className="font-mono text-white text-lg">{order.cust_id}</span></p>
                                                <p className="text-zinc-500">Purchased <strong className="text-zinc-400">{order.modules?.name}</strong> module.</p>
                                            </div>
                                            <div>
                                                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 font-bold text-sm border border-emerald-500/20 rounded-lg">
                                                    ACTIVATED
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {orderTab === 'req' && (
                        <div>
                            {reqOrders.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed">
                                    No decline requests to verify.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {reqOrders.map(order => (
                                        <div key={order.id} className="p-6 bg-zinc-950 border border-red-900/40 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center transition-all hover:border-red-500/30 gap-4">
                                            <div>
                                                <p className="font-bold text-red-400 mb-1 flex items-center gap-2">
                                                    CustID: <span className="font-mono text-white text-lg">{order.cust_id}</span>
                                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs rounded-md uppercase">Pending Decline</span>
                                                </p>
                                                <p className="text-zinc-400 text-sm mb-3">Module: <strong className="text-zinc-200">{order.modules?.name}</strong></p>
                                                <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl max-w-lg">
                                                    <p className="text-xs text-red-400 uppercase tracking-wider font-bold mb-1">Admin Reason</p>
                                                    <p className="text-sm text-zinc-300 italic">"{order.decline_reason}"</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <form action={async (formData) => {
                                                    const res = await approveModuleAccess(formData)
                                                    if (res && res.success) {
                                                        setReqOrders(prev => prev.filter(o => o.id !== res.orderId))
                                                    }
                                                }} className="flex-1 md:flex-none">
                                                    <input type="hidden" name="custId" value={order.cust_id} />
                                                    <input type="hidden" name="moduleId" value={order.modules?.id} />
                                                    <input type="hidden" name="orderId" value={order.id} />
                                                    <input type="hidden" name="decline" value="true" />
                                                    <input type="hidden" name="isFinalDecline" value="true" />
                                                    <button className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all">
                                                        Finalize Reject
                                                    </button>
                                                </form>
                                                <form action={async (formData) => {
                                                    const res = await approveModuleAccess(formData)
                                                    if (res && res.success && res.status === ORDER_STATUS.APPROVED) {
                                                        setReqOrders(prev => prev.filter(o => o.id !== res.orderId))
                                                        setActiveOrders(prev => [{ ...order, status: ORDER_STATUS.APPROVED }, ...prev])
                                                    }
                                                }} className="flex-1 md:flex-none">
                                                    <input type="hidden" name="custId" value={order.cust_id} />
                                                    <input type="hidden" name="moduleId" value={order.modules?.id} />
                                                    <input type="hidden" name="orderId" value={order.id} />
                                                    <input type="hidden" name="grantAccess" value="true" />
                                                    <button className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all border border-zinc-700">
                                                        Override & Approve
                                                    </button>
                                                </form>
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
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-6">
                        <h2 className="text-2xl font-bold mb-6 text-purple-400">Total Authority Management</h2>
                        <p className="text-zinc-400 mb-6 text-sm">Search for any tenant by their 10-digit CustID to manage roles or override module access.</p>

                        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter 10-digit CustID..."
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 font-mono text-sm"
                            />
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 text-sm"
                            >
                                {loading ? '...' : 'Search'}
                            </button>
                        </form>

                        {error && <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl mb-6 text-sm">{error}</div>}

                        <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-3">Tenant Directory</h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {allCustomers.length === 0 ? (
                                <p className="text-zinc-500 text-sm text-center py-4">No customers found.</p>
                            ) : (
                                allCustomers.filter((c: any) => c.cust_id.includes(searchId) || c.name.toLowerCase().includes(searchId.toLowerCase())).map((c: any) => (
                                    <button
                                        key={c.cust_id}
                                        onClick={() => openCustomerModal(c.cust_id)}
                                        className="w-full text-left p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all group flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-bold text-white group-hover:text-purple-400 transition-colors">{c.name}</p>
                                            <p className="text-xs text-zinc-500 font-mono mt-1">ID: {c.cust_id}</p>
                                        </div>
                                        <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm">
                                            Manage &rarr;
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-center border border-zinc-800/50 bg-zinc-900/10 rounded-3xl border-dashed">
                        <p className="text-zinc-600 text-sm">Select a customer directory entry to manage.</p>
                    </div>

                    {/* Glassmorphism Modal for Customer Details */}
                    {customer && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setCustomer(null)}
                            ></div>

                            {/* Modal Content */}
                            <div className="relative w-full max-w-2xl bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">

                                {/* Header */}
                                <div className="flex justify-between items-center p-6 border-b border-zinc-700/50 bg-zinc-800/40">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white tracking-tight">{customer.name}</h3>
                                            <p className="text-zinc-400 font-mono text-sm mt-1">CustID: {customer.cust_id} &bull; {customer.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full h-fit ${customer.user_roles.role === 'supreme_admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            customer.user_roles.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }`}>
                                            {customer.user_roles.role.toUpperCase()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setCustomer(null)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors flex items-center justify-center group"
                                        title="Close"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 max-h-[75vh] overflow-y-auto space-y-8">

                                    {/* Role Management */}
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Set System Authority</h4>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleRoleChange(customer.auth_id, 'customer')}
                                                disabled={customer.user_roles.role === 'customer' || loading}
                                                className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-blue-400 hover:bg-zinc-800 rounded-xl font-medium disabled:opacity-50 transition-colors text-sm"
                                            >
                                                Standard Customer
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(customer.auth_id, 'admin')}
                                                disabled={customer.user_roles.role === 'admin' || loading}
                                                className="flex-1 py-3 bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/50 rounded-xl font-medium disabled:opacity-50 transition-colors text-sm"
                                            >
                                                Promote Admin
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(customer.auth_id, 'supreme_admin')}
                                                disabled={customer.user_roles.role === 'supreme_admin' || loading}
                                                className="flex-1 py-3 bg-purple-900/30 border border-purple-800/50 text-purple-400 hover:bg-purple-900/50 rounded-xl font-medium disabled:opacity-50 transition-colors text-sm"
                                            >
                                                Supreme Admin
                                            </button>
                                        </div>
                                    </div>

                                    {/* Module Toggles */}
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Current Active Modules</h4>

                                        {customer.provisioned_modules?.length === 0 ? (
                                            <div className="p-4 border border-zinc-800 border-dashed rounded-xl bg-zinc-950/30">
                                                <p className="text-zinc-500 text-sm italic">This customer has not purchased any modules yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {customer.provisioned_modules.map((pm: any) => (
                                                    <div key={pm.modules.id} className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-zinc-700/30">
                                                        <div>
                                                            <p className="font-bold text-white">{pm.modules.name}</p>
                                                            <p className="text-xs text-zinc-500 font-mono mt-1">{pm.modules.slug}</p>
                                                        </div>
                                                        <button
                                                            disabled={loading}
                                                            onClick={() => handleModuleToggle(pm.modules.id, pm.is_active)}
                                                            className={`px-5 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm ${pm.is_active
                                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                                                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                                                                }`}
                                                        >
                                                            {pm.is_active ? 'ENABLED' : 'DISABLED'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'pricing' && (
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-purple-400">Global Pricing Manager</h2>
                    <p className="text-zinc-400 mb-8 max-w-2xl text-sm">Update the base subscription price for all available modules. Note that price changes only affect new incoming purchase requests or renewals, not currently paid and active subscriptions.</p>

                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-3xl p-6">
                        <div className="grid gap-4 max-w-4xl">
                            {allModules.map(mod => (
                                <div key={mod.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-2xl transition-all hover:border-purple-500/30 gap-4">
                                    <div>
                                        <p className="font-bold text-white text-lg">{mod.name}</p>
                                        <p className="text-xs text-zinc-500 font-mono mt-1">Slug: {mod.slug}</p>
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            const fd = new FormData(e.currentTarget)
                                            handlePriceUpdate(mod.id, Number(fd.get('price')))
                                        }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                defaultValue={mod.base_price}
                                                step="0.01"
                                                min="0"
                                                className="w-32 bg-zinc-950 border border-zinc-700 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-purple-500 font-mono font-bold"
                                                required
                                            />
                                        </div>
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                        >
                                            {loading ? '...' : 'Update Price'}
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
