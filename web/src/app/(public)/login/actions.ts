'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')

    // Redirection handled exclusively by middleware to correct dashboard
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        company: formData.get('company') as string,
    }

    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    })

    if (error || !authData.user) {
        redirect('/login?error=Could not clone user')
    }

    // Insert customer profile with random 10 digit CustID instantly
    const generateCustId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString()

    await supabase.from('customers').insert({
        cust_id: generateCustId(),
        auth_id: authData.user.id,
        name: data.company, // Store company as the customer name
        email: data.email,
        phone: 'Not Provided',
        address: 'Not Provided',
    })

    revalidatePath('/', 'layout')

    // Straight to dashboard, skipping onboarding
    redirect('/dashboard')
}
