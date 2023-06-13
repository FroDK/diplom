import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/schema'
import { cookies, headers } from 'next/headers'
import { FormsTable } from '@/widgets/FormsTable/FormsTable'

export default async function Profile() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data, error } = await supabase.from('contest').select('form')

  // @ts-ignore
  return <FormsTable data={data} />
}
