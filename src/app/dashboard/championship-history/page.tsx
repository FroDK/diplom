import ChampionshipHistory from '@/widgets/ChampionShipsHistory/ChampoinShipsHistory'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

export default async function ChampionShipHistoryPage() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const contestIdsResponse = await supabase
    .from('contest_user')
    .select(
      `
      contest_id
    `
    )
    .eq('user_id', user?.id)

  const contestIds = Array.from(
    new Set((contestIdsResponse.data || []).map((item) => item.contest_id))
  )

  const { data } = await supabase
    .from('contest')
    .select(
      `
      *,
      type_contest (*)
    `
    )
    .in('id', contestIds)

  return <ChampionshipHistory data={data} />
}
