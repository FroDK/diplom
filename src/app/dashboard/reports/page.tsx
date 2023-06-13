import { ReportsForm } from '@/widgets/ReportsForm/ReportsForm'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/schema'
import { cookies, headers } from 'next/headers'

export default async function Reports() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data: contests } = await supabase
    .from('contest')
    .select('*, type_contest(*)')

  const { data: experts } = await supabase
    .from('users')
    .select()
    .eq('user_role', 'expert')

  const { data: typeContests } = await supabase.from('type_contest').select()

  const {
    data: { user: user },
  } = await supabase.auth.getUser()

  return (
    <ReportsForm
      contests={contests as any[]}
      experts={experts as any[]}
      typeContests={typeContests as any[]}
      user={user}
    />
  )
}
