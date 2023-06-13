import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/schema'
import { cookies, headers } from 'next/headers'
import { TeamsCompositionTable } from '@/widgets/TeamsCompositionTable/TeamsCompositionTable'

export default async function Teams() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data, error } = await supabase
    .from('team_member')
    .select('is_captain, team(*), user(*)')

  // @ts-ignore
  return <TeamsCompositionTable data={data} />
}
