require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUpdate() {
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("KEY exists?", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Get the customer ID from DB (e.g. 3997126424)
    const { data: customer, error: errC } = await supabaseAdmin
        .from('customers')
        .select('auth_id')
        .eq('cust_id', '3997126424')
        .single();

    if (errC) {
        console.error("Error fetching customer:", errC);
        return;
    }

    console.log("Found auth_id:", customer.auth_id);

    const { error } = await supabaseAdmin
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('id', customer.auth_id);

    if (error) {
        console.error("Update Role Error:", error);
    } else {
        console.log("Update Role Success!");
    }
}

testUpdate();
