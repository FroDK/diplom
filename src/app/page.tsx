import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { getFirstNavByRole } from '@/widgets/Dashboard/models/navItems'

export default async function Home() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const { data, error } = await supabase.auth.getUser()

  if (!data.user) redirect('/sign_in')

  const { app_metadata } = data.user

  const routeToDashboard = getFirstNavByRole(app_metadata?.user_role ?? 'admin')

  redirect('/dashboard' + routeToDashboard)

  return <pre>{JSON.stringify(routeToDashboard, null, 2)}</pre>
}
