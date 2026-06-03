'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ORDER_STATUS } from '@/lib/constants'

export async function submitOrder(moduleId: string, custId: string) {
    const supabase = await createClient()

    // Ensure they don't already have an active or pending order for this
    const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('cust_id', custId)
        .eq('module_id', moduleId)
        .in('status', [ORDER_STATUS.PENDING, ORDER_STATUS.APPROVED])
        .maybeSingle()

    if (existing) {
        return { error: 'You already have a pending or active subscription for this module.' }
    }

    // Insert order
    const { error } = await supabase
        .from('orders')
        .insert({
            cust_id: custId,
            module_id: moduleId,
            status: ORDER_STATUS.PENDING
        })

    if (error) {
        console.error(error)
        return { error: 'Failed to submit order request.' }
    }

    // Create notification for admins
    await supabase
        .from('notifications')
        .insert({
            cust_id: custId,
            message: `Requested module access.`
        })

    revalidatePath('/')
    return { success: true }
}
export async function approveModuleAccess(formData: FormData) {
    const supabase = await createClient()

    const custId = formData.get('custId') as string
    const moduleId = formData.get('moduleId') as string
    const orderId = formData.get('orderId') as string
    const grantAccess = formData.get('grantAccess') === 'true'
    const declineOrder = formData.get('decline') === 'true'
    const declineReason = formData.get('declineReason') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    let newStatus = ''
    console.log('--- APPROVE MODULE ACCESS TRIGGERED ---')
    console.log('Order ID:', orderId, '| Decline:', declineOrder, '| Reason:', declineReason)

    if (declineOrder && orderId) {
        if (formData.get('isFinalDecline') === 'true') {
            await supabase.from('orders').update({ status: ORDER_STATUS.REJECTED }).eq('id', orderId)
            newStatus = ORDER_STATUS.REJECTED
        } else {
            // First step in Two-Step Decline Workflow: propose a decline
            const payload: any = { status: ORDER_STATUS.PENDING_DECLINE }
            if (declineReason) payload.decline_reason = declineReason
            console.log('Attempting to update order with payload:', payload)
            const { error: updateErr } = await supabase.from('orders').update(payload).eq('id', orderId)
            if (updateErr) console.error('Supabase Update Error:', updateErr)
            newStatus = ORDER_STATUS.PENDING_DECLINE
        }
    } else if (grantAccess) {
        // 1. Give Access in customer_modules
        await supabase.from('customer_modules').upsert({
            cust_id: custId,
            module_id: moduleId,
            is_active: true,
            granted_by: user.id
        }, { onConflict: 'cust_id, module_id' })

        // 2. Mark order approved
        if (orderId) {
            await supabase.from('orders').update({ status: ORDER_STATUS.APPROVED }).eq('id', orderId)
            newStatus = ORDER_STATUS.APPROVED
        }
    } else {
        // Revoke access
        await supabase.from('customer_modules').update({ is_active: false }).eq('cust_id', custId).eq('module_id', moduleId)
        newStatus = 'revoked'
    }

    revalidatePath('/', 'layout')
    return { success: true, orderId, status: newStatus }
}
