import {
  TypeContestTable,
  TypeContestType,
} from '@/widgets/TypeContestTable/TypeContestTable'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { Database } from '@/schema'

export default async function TypeContest() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data, error } = await supabase.from('type_contest').select()

  const contestTypes: TypeContestType[] | undefined = data?.map(
    (type, index) => ({
      id: ++index,
      name: type.name,
      key: type.id,
    })
  )

  return <TypeContestTable data={contestTypes ?? []} />
}
