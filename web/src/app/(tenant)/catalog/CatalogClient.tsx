'use client'

import { useState } from 'react'
import { submitCartCheckout } from './actions'

type Module = {
    id: string
    name: string
    slug: string
    description: string
    base_price: number
}

type CatalogClientProps = {
    modules: Module[]
    myModules: any[]
    myOrders: any[]
    custId: string
}

export default function CatalogClient({ modules, myModules, myOrders, custId }: CatalogClientProps) {
    const [cart, setCart] = useState<Module[]>([])
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const toggleCart = (mod: Module) => {
        if (cart.some(m => m.id === mod.id)) {
            setCart(cart.filter(m => m.id !== mod.id))
        } else {
            setCart([...cart, mod])
        }
    }

    const handleCheckout = async () => {
        setIsCheckingOut(true)
        setSuccessMessage('')

        const moduleIds = cart.map(m => m.id)
        const result = await submitCartCheckout(moduleIds, custId)

        if (result.error) {
            alert(result.error)
            setIsCheckingOut(false)
        } else {
            setCart([])
            setSuccessMessage('Checkout successful! Orders have been submitted to Administration for provisioning.')
            setIsCheckingOut(false)
        }
    }

    const cartTotal = cart.reduce((acc, curr) => acc + curr.base_price, 0)

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Catalog Grid */}
            <div className="flex-1">
                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold">
                        ✓ {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules?.map(mod => {
                        const hasAccess = myModules?.some(m => m.module_id === mod.id && m.is_active)
                        const isPending = myOrders?.some(o => o.module_id === mod.id)
                        const inCart = cart.some(m => m.id === mod.id)

                        return (
                            <div key={mod.id} className={`bg-zinc-900 border ${inCart ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-zinc-800'} rounded-3xl p-6 flex flex-col transition-all`}>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{mod.name}</h3>
                                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{mod.description || 'Enterprise-grade supply chain infrastructure.'}</p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-zinc-500 font-medium text-xs">Price</span>
                                        <span className="text-xl font-bold">${mod.base_price}/mo</span>
                                    </div>

                                    {hasAccess ? (
                                        <div className="w-full py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded-lg text-center text-sm">
                                            Active
                                        </div>
                                    ) : isPending ? (
                                        <div className="w-full py-2.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold rounded-lg text-center text-sm">
                                            Order Pending
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleCart(mod)}
                                            className={`w-full py-2.5 font-bold rounded-lg transition-all text-sm ${inCart
                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                                                    : 'bg-white text-black hover:bg-zinc-200'
                                                }`}
                                        >
                                            {inCart ? 'Remove from Cart' : 'Add to Cart'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Sticky Cart Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Your Cart
                    </h2>

                    {cart.length === 0 ? (
                        <p className="text-zinc-500 text-sm italic py-4 text-center border-t border-zinc-800">Your cart is empty.</p>
                    ) : (
                        <div className="flex flex-col h-full space-y-4 border-t border-zinc-800 pt-4">
                            <div className="space-y-3 flex-1">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300 truncate pr-2">{item.name}</span>
                                        <span className="font-mono text-white">${item.base_price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-zinc-700 pt-4 mb-2">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-purple-400">${cartTotal}/mo</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
                            >
                                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
