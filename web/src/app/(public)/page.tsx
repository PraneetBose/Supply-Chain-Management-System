export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Modular Phase 1 Complete
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                Supply Chain Management, <br /> Built for Scale.
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10">
                A completely modular SaaS platform designed for modern enterprises. Purchase only the modules your business actually needs, from Advanced Inventory to Global Procurement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <a href="/signup" className="px-8 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98]">
                    Start Free Trial
                </a>
                <a href="/pricing" className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-[0.98]">
                    View Module Pricing
                </a>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full text-left">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Modular Architecture</h3>
                    <p className="text-zinc-400 text-sm">Every capability is compartmentalized. Start small and provision new modules dynamically as your business scales.</p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Enterprise Security</h3>
                    <p className="text-zinc-400 text-sm">Strict multi-tenant data isolation backed by PostgreSQL Row Level Security for absolute data privacy.</p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Centralized Authority</h3>
                    <p className="text-zinc-400 text-sm">A three-tiered role system allows internal Company Admins to manage staff alongside our Supreme Admin safeguards.</p>
                </div>
            </div>
        </div>
    )
}
