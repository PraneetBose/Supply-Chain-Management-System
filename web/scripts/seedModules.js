const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Manual unquoted parser
const envContent = fs.readFileSync('.env.local', 'utf8')
const getEnv = (key) => {
    const line = envContent.split('\n').find(l => l.startsWith(key))
    if (!line) return null
    return line.split('=')[1].trim().replace(/^['"]|['"]$/g, '')
}

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
const key = getEnv('SUPABASE_SERVICE_ROLE_KEY')

if (!url || !key) {
    console.error('Missing URL or Service Role Key in .env.local')
    process.exit(1)
}

const supa = createClient(url, key)

async function seed() {
    console.log('Inserting seed modules...')
    const modules = [
        { name: 'Inventory Management', slug: 'inventory-management', description: 'Real-time stock tracking, barcode integration, and low-stock alerts across multiple storage locations.', base_price: 199.00 },
        { name: 'Procurement Management', slug: 'procurement-management', description: 'Automate purchase orders, manage vendor relationships, and negotiate better rates by tracking spend.', base_price: 149.00 },
        { name: 'Warehouse Management', slug: 'warehouse-management', description: 'Optimize inbound/outbound logistics, routing, and bin-level inventory tracking for your warehouse.', base_price: 299.00 },
        { name: 'Order Management', slug: 'order-management', description: 'Streamline the entire lifecycle from order capture to fulfillment, shipping, and returns.', base_price: 249.00 },
        { name: 'Analytics', slug: 'analytics', description: 'Powerful reports, predictive demand forecasting, and customizable dashboards for executive insights.', base_price: 399.00 }
    ]

    const { data, error } = await supa.from('modules').upsert(modules, { onConflict: 'slug' }).select()

    if (error) {
        console.error('Error seeding modules:', error)
    } else {
        console.log('Successfully seeded modules:', data.length)
    }
}

seed()
