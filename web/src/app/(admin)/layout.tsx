import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ORDER_STATUS } from '@/lib/constants'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
    redirect('/login')
}

const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single()

if (roleData?.role !== 'admin' && roleData?.role !== 'supreme_admin') {
    redirect('/dashboard')
}

    // Get pending order count for the notification badge
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', ORDER_STATUS.PENDING)

    return (
        <div className="flex h-screen bg-zinc-950 font-sans text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
                <div className="p-6 border-b border-zinc-800">
                    <div className="font-bold text-xl tracking-tight mb-1 text-emerald-400">Admin Portal</div>
                    <div className="text-xs text-zinc-500 font-mono truncate">{user.email}</div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Platform Overview
                        </Link>
                        <Link href="/admin/dashboard?tab=orders" className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Pending Orders
                            {count && count > 0 ? (
                                <span className="bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                            ) : null}
                        </Link>
                        <Link href="/admin/dashboard?tab=manage" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Tenant Management
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <form action="/auth/signout" method="post">
                        <button className="w-full px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                            Sign out Securely
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
