import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { ERoles } from '@/widgets/Dashboard/models/navItems'
import { UserTable, UserType } from '@/widgets/UserTable/UserTable'

export default async function Users() {
  const supabase = createServerComponentSupabaseClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SERVICE_ROLE,
    headers,
    cookies,
  })

  const { data: users, error } = await supabase.from('users').select()

  return <UserTable users={users as UserType[]} />
}
