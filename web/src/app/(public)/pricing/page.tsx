const modules = [
    {
        name: 'Advanced Inventory',
        description: 'Track stock positions, fulfillment readiness, and reorder signals across every warehouse.',
        price: '$49',
        accent: 'text-blue-400',
        border: 'hover:border-blue-500/40',
    },
    {
        name: 'Global Procurement',
        description: 'Coordinate purchase requests, supplier approvals, and procurement activity from one workspace.',
        price: '$79',
        accent: 'text-emerald-400',
        border: 'hover:border-emerald-500/40',
    },
    {
        name: 'Admin Controls',
        description: 'Manage module access, pricing updates, and role-based workflows for growing teams.',
        price: '$99',
        accent: 'text-purple-400',
        border: 'hover:border-purple-500/40',
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-zinc-950 px-6 py-16">
            <section className="mx-auto max-w-6xl text-center">
                <div className="mb-5 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                    Modular pricing
                </div>

                <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                    Start with the modules your supply chain needs today.
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
                    Each module can be provisioned independently, so teams can adopt the SCM platform without paying for unused workflows.
                </p>
            </section>

            <section className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
                {modules.map((module) => (
                    <article
                        key={module.name}
                        className={`flex min-h-72 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-left transition-colors ${module.border}`}
                    >
                        <p className={`mb-4 text-sm font-semibold uppercase tracking-widest ${module.accent}`}>
                            {module.name}
                        </p>
                        <div className="mb-5 flex items-end gap-2">
                            <span className="text-4xl font-extrabold text-white">{module.price}</span>
                            <span className="pb-1 text-sm text-zinc-500">/ month</span>
                        </div>
                        <p className="flex-1 text-sm leading-6 text-zinc-400">{module.description}</p>
                        <a
                            href="/signup"
                            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-200"
                        >
                            Start with this module
                        </a>
                    </article>
                ))}
            </section>
        </div>
    )
}
