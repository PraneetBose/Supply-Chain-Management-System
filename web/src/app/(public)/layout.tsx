export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-white">
            {/* Public Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight">SCM<span className="text-blue-500">Platform</span></div>
                    <div className="flex gap-4">
                        <a href="/login" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">Log in</a>
                        <a href="/signup" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">Sign up</a>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                {children}
            </main>
        </div>
    )
}
