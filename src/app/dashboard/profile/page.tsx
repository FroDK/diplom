import { Profile } from '@/widgets/Profile/Profile'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

export default async function MyPage() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <Profile data={user} />
}
