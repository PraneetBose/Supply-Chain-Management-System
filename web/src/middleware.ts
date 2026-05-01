import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    // 1. Maintain Supabase session hook
    const { response, supabase } = await updateSession(request)

    // 2. Check Authentication
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // Public Paths (No auth required)
    const isPublicPath = path === '/' || path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/pricing') || path.startsWith('/auth')

    if (!user && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user) {
        // If logged in user tries to visit a public path, push them to dashboard
        if (isPublicPath && !path.startsWith('/auth')) {
            // We must determine WHICH dashboard based on their role
            const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
            const role = roleData?.role || 'customer'

            if (role === 'supreme_admin') return NextResponse.redirect(new URL('/supreme/dashboard', request.url))
            if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Role-based Path Protection
        const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single()
        const role = roleData?.role || 'customer'

        // Tenant constraints (Customer role)
        if (role === 'customer' && (path.startsWith('/admin') || path.startsWith('/supreme'))) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Admin constraints
        if (role === 'admin' && path.startsWith('/supreme')) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
