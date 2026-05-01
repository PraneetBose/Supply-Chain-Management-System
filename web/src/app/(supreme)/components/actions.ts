'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Supreme Admin Only: Search for a customer by CustID and view their details
export async function searchCustomerByCustId(custId: string) {
    const supabase = await createClient()

    // Verify supreme auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
    if (roleData?.role !== 'supreme_admin') return { error: 'Unauthorized' }

    // 1. Get Customer Profile
    const { data: customer, error: errC } = await supabase
        .from('customers')
        .select('*')
        .eq('cust_id', custId)
        .single()

    if (errC || !customer) return { error: 'Customer not found' }

    // 1b. Get their Role (Using Admin client because RLS blocks reading other users' roles)
    const { createClient: createClientRaw } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClientRaw(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: roleDataAssoc } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('id', customer.auth_id)
        .single()

    customer.user_roles = { role: roleDataAssoc?.role || 'customer' }

    // 2. Get their Provisioned Modules
    const { data: modules } = await supabase
        .from('customer_modules')
        .select(`
      is_active,
      modules (id, name, slug)
    `)
        .eq('cust_id', custId)

    return {
        customer: {
            ...customer,
            provisioned_modules: modules || []
        }
    }
}

// Supreme Admin Only: Elevate or Demote a user's role
export async function changeUserRole(authId: string, newRole: 'customer' | 'admin' | 'supreme_admin') {
    const supabase = await createClient()

    // Verify supreme auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
    if (roleData?.role !== 'supreme_admin') return { error: 'Unauthorized' }

    // Prevent removing your own supreme admin role accidentally
    if (authId === user.id && newRole !== 'supreme_admin') {
        return { error: 'Cannot demote yourself.' }
    }

    // To update user_roles out-of-band, we must bypass RLS using the service_role key
    const { createClient: createClientRaw } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClientRaw(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', authId)

    if (error) return { error: `Failed to update role: ${error.message}` }

    revalidatePath('/supreme/dashboard')
    return { success: true }
}

// Supreme Admin Only: Radically toggle module access
export async function toggleModuleAccess(custId: string, moduleId: string, currentlyActive: boolean) {
    const supabase = await createClient()

    // Verify supreme auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
    if (roleData?.role !== 'supreme_admin') return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('customer_modules')
        .update({ is_active: !currentlyActive })
        .eq('cust_id', custId)
        .eq('module_id', moduleId)

    if (error) return { error: 'Failed to update module access' }

    revalidatePath('/supreme/dashboard')
    return { success: true }
}

// Supreme Admin Only: Update module base price
export async function updateModulePrice(moduleId: string, newPrice: number) {
    const supabase = await createClient()

    // Verify supreme auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
    if (roleData?.role !== 'supreme_admin') return { error: 'Unauthorized' }

    if (newPrice < 0) return { error: 'Price cannot be negative' }

    const { error } = await supabase
        .from('modules')
        .update({ base_price: newPrice })
        .eq('id', moduleId)

    if (error) return { error: `Failed to update price: ${error.message}` }

    revalidatePath('/supreme/dashboard', 'page')
    revalidatePath('/catalog', 'page')
    revalidatePath('/dashboard', 'page')
    revalidatePath('/', 'layout') // Global clear just in case
    return { success: true }
}
