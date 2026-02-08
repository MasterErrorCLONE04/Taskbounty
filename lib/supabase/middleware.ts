import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // 1. Define Public and Protected Routes
    // Dashboard and Management paths are strictly protected
    const isDashboardPath = path.startsWith('/client') || path.startsWith('/worker')
    const isTaskManagementPath = path.startsWith('/tasks/create') ||
        path.includes('/manage') ||
        path.includes('/work')

    const isProtectedPath = isDashboardPath || isTaskManagementPath

    // 2. Auth Guard
    if (!user && isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. BACK BUTTON PROTECTION: Disable caching for protected routes
    // This ensures that clicking "back" after logout forces a re-request, 
    // which then triggers the Auth Guard above.
    if (isProtectedPath) {
        response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
    }

    return response
}
