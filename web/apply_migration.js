// Script to apply database migration
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // We can use RPC or a raw query if pg is installed, but since we just need to add a column:
    const pg = require('pg');
    const { Client } = pg;

    // Parse connection string from supabase settings or project URL
    // Actually, let's just use the supabase client's rpc if we had one, but we don't.
    // We will just use pg directly with the local postgres URL.
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        await client.query(`
            ALTER TABLE public.orders 
            ADD COLUMN IF NOT EXISTS decline_reason TEXT;
        `);
        console.log('Migration applied successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
