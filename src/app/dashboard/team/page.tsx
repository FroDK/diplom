import TeamItem from './components/TeamItem'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

export default async function Team() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase.from('team').select(`
      id,
      name,
      team_member (
        id,
        is_captain,
        users (
          id,
          fio,
          email,
          phone
        )
      ),
      contest (
        title,
        created_at,
        status
      )
    `)

  const myTeams = (data || []).filter((item) => {
    // @ts-ignore
    return item.team_member.some((item2) => item2.users.id === user?.id)
  })

  return myTeams.map((item) => {
    return (
      <TeamItem
        key={item.id}
        // @ts-ignore
        contestDate={item.contest.created_at}
        // @ts-ignore
        contestName={item.contest.title}
        // @ts-ignore
        contestStatus={item.contest.status}
        teamName={item.name}
        // @ts-ignore
        teamMembers={item.team_member}
      />
    )
  })
}
