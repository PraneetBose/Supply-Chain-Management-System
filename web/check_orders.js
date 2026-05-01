require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from('orders').select('id, cust_id, status, decline_reason').order('created_at', { ascending: false }).limit(5);
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
}
test();
