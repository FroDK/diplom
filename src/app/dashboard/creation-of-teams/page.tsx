import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { CreationTeamsHOC } from '@/widgets/CreationTeams/CreationTeams'
import { IBattle } from '../criteria-form/page/CriteriaFormPage'

const formatDate = (date?: string) => {
  if (!date) {
    return
  }

  return new Date(date).toLocaleDateString('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default async function CreationOfTeams() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const { data } = await supabase.from('contest').select(`
      id,
      title,
      kind_of_contest,
      status,
      created_at,
      users (
        id,
        fio,
        email,
        user_role
      ),
      team (
        id,
        name
      ),
      type_contest (
        name
      )
    `)

  // @ts-ignore
  const sortArr: IBattle[] = [...data].sort((a) => {
    return a.status === 'completed' ? 1 : -1
  })

  return (
    <>
      {sortArr &&
        sortArr.map((item) => (
          <CreationTeamsHOC
            key={item.id}
            contestId={item.id}
            name={item.title}
            date={formatDate(item.created_at)}
            type={item.type_contest.name}
            subType={item.kind_of_contest}
            status={item.status}
          />
        ))}
    </>
  )
}
