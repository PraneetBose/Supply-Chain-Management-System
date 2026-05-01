'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitOrder(moduleId: string, custId: string) {
    const supabase = await createClient()

    // Ensure they don't already have an active or pending order for this
    const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('cust_id', custId)
        .eq('module_id', moduleId)
        .in('status', ['pending', 'approved'])
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
            status: 'pending'
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

export async function runMigration() {
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query('ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS decline_reason TEXT');
    await client.query(`
        ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
        ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'pending_decline'));
    `);
    await client.end();
    return { success: true };
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
            await supabase.from('orders').update({ status: 'rejected' }).eq('id', orderId)
            newStatus = 'rejected'
        } else {
            // First step in Two-Step Decline Workflow: propose a decline
            const payload: any = { status: 'pending_decline' }
            if (declineReason) payload.decline_reason = declineReason
            console.log('Attempting to update order with payload:', payload)
            const { error: updateErr } = await supabase.from('orders').update(payload).eq('id', orderId)
            if (updateErr) console.error('Supabase Update Error:', updateErr)
            newStatus = 'pending_decline'
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
            await supabase.from('orders').update({ status: 'approved' }).eq('id', orderId)
            newStatus = 'approved'
        }
    } else {
        // Revoke access
        await supabase.from('customer_modules').update({ is_active: false }).eq('cust_id', custId).eq('module_id', moduleId)
        newStatus = 'revoked'
    }

    revalidatePath('/', 'layout')
    return { success: true, orderId, status: newStatus }
}
