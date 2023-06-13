import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/schema'
import { cookies, headers } from 'next/headers'
import { TeamsTable } from '@/widgets/TeamsTable/TeamsTable'

export default async function Teams() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data, error } = await supabase.from('team').select('name')

  // @ts-ignore
  return <TeamsTable data={data} />
}
