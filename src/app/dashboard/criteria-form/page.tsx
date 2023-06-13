import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import CriteriaFormPage from './page/CriteriaFormPage'
import { cookies, headers } from 'next/headers'

export default async function CriteriaForm() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase.from('contest').select(`
      *,
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

  // @ts-ignore
  return <CriteriaFormPage data={data} id={user?.id as string} />
}
