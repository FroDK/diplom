import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith('/api/admin')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const session = await supabase.auth.getSession()

  const user = session.data.session?.user

  if (!user) {
    NextResponse.redirect(new URL('/sign_in', req.url))
  }

  const isAdmin = user?.app_metadata?.claims_admin

  if (isAdminRoute(pathname) && !isAdmin) {
    return new Response('Forbidden', {
      status: 403,
    })
  }

  return res
}
