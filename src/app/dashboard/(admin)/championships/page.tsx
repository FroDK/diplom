import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { ERoles } from '@/widgets/Dashboard/models/navItems'
import { UserTable, UserType } from '@/widgets/UserTable/UserTable'
import { Database } from '@/schema'
import {
  ChampionshipTable,
  ContestDataType,
} from '@/widgets/ChampionshipTable/ChampionshipTable'

export default async function Championships() {
  const supabase = createServerComponentSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SERVICE_ROLE,
    headers,
    cookies,
  })

  const { data, error } = await supabase.from('contest').select(`
      id,
      title,
      address,
      city,
      country,
      description,
      kind_of_contest,
      status,
      created_at,
      users (
        id,
        fio,
        email,
        user_role
      ),
      type_contest (
        id,
        name
      )
    `)

  return <ChampionshipTable contests={data as unknown as ContestDataType[]} />
}
