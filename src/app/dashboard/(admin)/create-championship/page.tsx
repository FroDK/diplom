import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { CreateChampionshipForm } from '@/widgets/CreateChampionshipForm/CreateChampionshipForm'

export default async function Championship() {
  const supabase = createServerComponentSupabaseClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SERVICE_ROLE,
    headers,
    cookies,
  })

  const { data: typesContest } = await supabase.from('type_contest').select()
  const { data: users } = await supabase.from('users').select()

  return <CreateChampionshipForm users={users} typesContest={typesContest} />
}
