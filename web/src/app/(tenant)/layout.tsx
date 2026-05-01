import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TenantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Middleware guarantees we have a user
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch their active modules to render the sidebar dynamically
    const { data: customerData } = await supabase
        .from('customers')
        .select('cust_id, name')
        .eq('auth_id', user!.id)
        .single()

    let activeModules: any[] = []
    if (customerData) {
        const { data } = await supabase
            .from('customer_modules')
            .select('*, modules(*)')
            .eq('cust_id', customerData.cust_id)
            .eq('is_active', true)

        activeModules = data || []
    }

    // Fetch ALL modules so we can know which are locked
    const { data: allModules } = await supabase.from('modules').select('*')

    return (
        <div className="flex h-screen bg-zinc-950 font-sans text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
                <div className="p-6 border-b border-zinc-800">
                    <div className="font-bold text-xl tracking-tight mb-1">SCM<span className="text-blue-500">Platform</span></div>
                    <div className="text-xs text-zinc-500 font-mono">Tenant ID: {customerData?.cust_id}</div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Main Menu</div>
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-800/50 text-white">
                            Dashboard
                        </Link>
                        <Link href="/catalog" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Module Catalog
                        </Link>
                        <Link href="/billing" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Billing
                        </Link>
                    </nav>

                    <div className="mt-8 px-3">
                        <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">My Modules</div>
                        <nav className="space-y-1">
                            {allModules?.map(mod => {
                                const isUnlocked = activeModules?.some(am => am.module_id === mod.id)

                                if (isUnlocked) {
                                    return (
                                        <Link key={mod.id} href={`/modules/${mod.slug}`} className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                                            {mod.name}
                                        </Link>
                                    )
                                }

                                return (
                                    <Link key={mod.id} href="/catalog" className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-zinc-500 hover:bg-zinc-800 transition-colors group">
                                        {mod.name}
                                        <span className="text-xs bg-zinc-800 group-hover:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">🔒</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <form action="/auth/signout" method="post">
                        <button className="w-full px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
