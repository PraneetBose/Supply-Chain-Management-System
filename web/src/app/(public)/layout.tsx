export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-white">
            {/* Public Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                            📦
                        </div>
                        <span className="font-extrabold text-lg tracking-tight bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">SCM Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                            Sign In
                        </a>
                        <a href="/login?mode=signup" className="px-4 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl transition-all shadow-md active:scale-95">
                            Register Company &rarr;
                        </a>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                {children}
            </main>
        </div>
    )
}
