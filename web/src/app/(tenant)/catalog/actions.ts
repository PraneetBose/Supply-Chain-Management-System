'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ORDER_STATUS } from '@/lib/constants'

export async function submitCartCheckout(moduleIds: string[], custId: string) {
    if (!moduleIds || moduleIds.length === 0) return { error: 'Cart is empty' }

    const supabase = await createClient()

    // 1. Check if they have pending orders for any of these
    const { data: pendingOrders } = await supabase
        .from('orders')
        .select('module_id')
        .eq('cust_id', custId)
        .in('module_id', moduleIds)
        .eq('status', ORDER_STATUS.PENDING)

    // 2. Check if they already have ACTIVE access to any of these
    const { data: activeMods } = await supabase
        .from('customer_modules')
        .select('module_id')
        .eq('cust_id', custId)
        .in('module_id', moduleIds)
        .eq('is_active', true)

    if ((pendingOrders && pendingOrders.length > 0) || (activeMods && activeMods.length > 0)) {
        return { error: 'You have already requested or already own one or more of these modules.' }
    }

    // Insert orders in bulk
    const ordersToInsert = moduleIds.map(modId => ({
        cust_id: custId,
        module_id: modId,
        status: ORDER_STATUS.PENDING
    }))

    const { error: insertError } = await supabase
        .from('orders')
        .insert(ordersToInsert)

    if (insertError) {
        console.error(insertError)
        return { error: 'Failed to submit order request. ' + insertError.message }
    }

    // Create notification for admins
    await supabase
        .from('notifications')
        .insert({
            cust_id: custId,
            message: `Requested access to ${moduleIds.length} modules.`
        })

    revalidatePath('/catalog')
    revalidatePath('/admin/dashboard')
    revalidatePath('/supreme/dashboard')
    return { success: true }
}
