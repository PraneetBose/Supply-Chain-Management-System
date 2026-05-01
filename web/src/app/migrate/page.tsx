'use client'
import { runMigration } from '@/app/components/actions'

export default function Migrate() {
    return <button onClick={() => runMigration().then(r => alert(JSON.stringify(r)))}>Run Migration</button>
}
