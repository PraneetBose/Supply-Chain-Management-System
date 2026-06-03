'use client'
import { runMigration } from '@/app/(supreme)/components/actions'

export default function MigratePage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-purple-400">Database Migration</h1>
            <p className="text-zinc-400 mb-6">
                Run pending database schema migrations. This action is restricted to supreme admins
                and cannot be executed in production.
            </p>
            <button
                onClick={() => runMigration().then(r => alert(JSON.stringify(r)))}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
            >
                Run Migration
            </button>
        </div>
    )
}
