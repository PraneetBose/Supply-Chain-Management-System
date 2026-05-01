require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function migrate() {
    const client = new Client(process.env.DATABASE_URL_SESSION);
    try {
        console.log("Connecting on 5432...");
        await client.connect();
        console.log("Connected to Supabase Postgres.");

        // 1. Add decline_reason column
        await client.query('ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS decline_reason TEXT;');
        console.log("Added decline_reason column.");

        // 2. Update status constraint
        await client.query(`
            ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
            ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'pending_decline'));
        `);
        console.log("Updated status constraint.");

        // 3. Add UPDATE policy for Admins on orders
        await client.query(`
            DROP POLICY IF EXISTS "Admins update all orders" ON public.orders;
            CREATE POLICY "Admins update all orders" ON public.orders FOR UPDATE USING (
                EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
            );
        `);
        console.log("Added RLS UPDATE policy for admins.");

        console.log("Migration complete.");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await client.end();
    }
}

migrate();
