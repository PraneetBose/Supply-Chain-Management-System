export default function LandingPage() {
    return (
        <div className="bg-zinc-950 text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-8 py-24 md:py-32 flex flex-col items-center justify-center text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-zinc-950">
                {/* Visual Glow elements (Pulsating) */}
                <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />
                <div className="absolute bottom-[10%] right-[20%] w-[350px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

                <div className="animate-fade-in-up flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 tracking-wider uppercase animate-float">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Next-Gen SCM Infrastructure
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 max-w-5xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-505">
                        Enterprise Supply Chain, <br className="hidden md:inline"/> Reimagined.
                    </h1>

                    <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mb-12 leading-relaxed">
                        A secure, multi-tenant SaaS platform built on **Next.js 16** and **Supabase**. Dynamically provision modular capabilities tailored directly to your supply chain workflows.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <a href="/login?mode=signup" className="px-8 py-4.5 bg-white text-zinc-950 font-extrabold rounded-xl hover:bg-zinc-200 hover:scale-105 duration-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98] text-base">
                            Start Free Trial
                        </a>
                        <a href="/login" className="px-8 py-4.5 bg-zinc-900 text-white font-extrabold rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:scale-105 duration-200 transition-all active:scale-[0.98] text-base">
                            Explore Catalog &rarr;
                        </a>
                    </div>
                </div>

                {/* Real-time Stats Grid */}
                <div className="animate-fade-in-up delay-200 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-xl rounded-3xl text-left">
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Transit Optimization</p>
                        <p className="text-3xl font-black text-emerald-400 animate-float" style={{ animationDuration: '5s' }}>-24%</p>
                        <p className="text-zinc-400 text-xs mt-1">Avg. Delivery Cycles</p>
                    </div>
                    <div className="border-l border-zinc-800/80 pl-6">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Platform Security</p>
                        <p className="text-3xl font-black text-emerald-400 animate-float" style={{ animationDuration: '6s' }}>100%</p>
                        <p className="text-zinc-400 text-xs mt-1">PostgreSQL RLS Enforced</p>
                    </div>
                    <div className="border-l border-zinc-800/80 pl-6">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Integration Uptime</p>
                        <p className="text-3xl font-black text-emerald-400 animate-float" style={{ animationDuration: '4s' }}>99.99%</p>
                        <p className="text-zinc-400 text-xs mt-1">Guaranteed SLA Uptime</p>
                    </div>
                    <div className="border-l border-zinc-800/80 pl-6">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Scale Metrics</p>
                        <p className="text-3xl font-black text-emerald-400 animate-float" style={{ animationDuration: '7s' }}>4.0M+</p>
                        <p className="text-zinc-400 text-xs mt-1">Mock Shipments Tracked</p>
                    </div>
                </div>
            </section>

            {/* Featured SCM Modules Showcase */}
            <section className="px-8 py-24 max-w-7xl mx-auto border-t border-zinc-900">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Enterprise Capabilities Catalog</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Select and subscribe to custom-tailored enterprise SCM components. Pay only for the resources your team utilizes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="animate-fade-in-up delay-200 p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:shadow-[0_10px_35px_rgba(16,185,129,0.12)] hover:-translate-y-2 duration-300 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-300 transition-transform">
                                📊
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">Advanced Inventory</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">Real-time logistics ledger tracking warehouse items, stock warnings, and transaction receipts.</p>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 duration-300 transition-transform inline-flex items-center gap-1">Available in catalog &rarr;</span>
                    </div>

                    <div className="animate-fade-in-up delay-400 p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:shadow-[0_10px_35px_rgba(16,185,129,0.12)] hover:-translate-y-2 duration-300 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-300 transition-transform">
                                🤝
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">Supplier Hub</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">Streamlined bidding portal enabling transparent quotation workflows and multi-vendor integrations.</p>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 duration-300 transition-transform inline-flex items-center gap-1">Available in catalog &rarr;</span>
                    </div>

                    <div className="animate-fade-in-up delay-600 p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:shadow-[0_10px_35px_rgba(16,185,129,0.12)] hover:-translate-y-2 duration-300 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-300 transition-transform">
                                🚛
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">Fleet Telematics</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">GPS tracking simulator displaying transport latency and automatically updating estimated delivery times.</p>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 duration-300 transition-transform inline-flex items-center gap-1">Available in catalog &rarr;</span>
                    </div>

                    <div className="animate-fade-in-up delay-600 p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:shadow-[0_10px_35px_rgba(16,185,129,0.12)] hover:-translate-y-2 duration-300 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-300 transition-transform">
                                🔮
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">Demand Forecast</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">Predictive warehouse analysis leveraging machine learning models to suggest restocking frequencies.</p>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 duration-300 transition-transform inline-flex items-center gap-1">Available in catalog &rarr;</span>
                    </div>
                </div>
            </section>

            {/* Interactive Workflow Lifecycle Stepper */}
            <section className="px-8 py-24 bg-zinc-900/20 border-t border-zinc-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Provisioning Order Lifecycle</h2>
                        <p className="text-zinc-400 text-lg max-w-xl mx-auto">Explore how module checkout requests flow safely through our role-based authorization pipeline.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Process Flow Line */}
                        <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-500/30 via-emerald-500 to-emerald-500/30 z-0 pointer-events-none" />

                        <div className="animate-fade-in-up delay-200 relative bg-zinc-950 border border-zinc-850 p-6 rounded-2xl z-10 flex flex-col items-center text-center shadow-lg hover:border-zinc-700 duration-300 transition-all">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center justify-center mb-4 text-sm font-mono">1</div>
                            <h4 className="font-bold text-lg mb-2">Customer Request</h4>
                            <p className="text-zinc-400 text-sm">Customers add catalog items to their cart and checkout. A pending order is posted instantly.</p>
                        </div>

                        <div className="animate-fade-in-up delay-400 relative bg-zinc-950 border border-emerald-500/20 p-6 rounded-2xl z-10 flex flex-col items-center text-center shadow-xl hover:border-emerald-500/40 duration-300 transition-all">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-extrabold flex items-center justify-center mb-4 text-sm font-mono">2</div>
                            <h4 className="font-bold text-lg mb-2">Admin Evaluation</h4>
                            <p className="text-zinc-400 text-sm">Admins audit incoming pending orders, electing to approve provision or trigger a decline proposal.</p>
                        </div>

                        <div className="animate-fade-in-up delay-600 relative bg-zinc-950 border border-zinc-850 p-6 rounded-2xl z-10 flex flex-col items-center text-center shadow-lg hover:border-zinc-700 duration-300 transition-all">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center justify-center mb-4 text-sm font-mono">3</div>
                            <h4 className="font-bold text-lg mb-2">Supreme Governance</h4>
                            <p className="text-zinc-400 text-sm">Supreme admin handles escalated decline reviews or manages billing price overrides dynamically.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 bg-zinc-950 px-8 py-12 text-center text-zinc-500 text-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-400">Enterprise SCM Portal</span>
                        <span className="text-zinc-700">|</span>
                        <span>Modular SaaS Platform</span>
                    </div>
                    <p className="text-xs">&copy; {new Date().getFullYear()} SCM Inc. Licensed under MIT. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
