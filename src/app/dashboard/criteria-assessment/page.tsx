import CriterianAssessment from '@/widgets/CriterianAssessment/CriterianAssessment'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

export default async function CriteriaAssessment() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase.from('contest').select(`
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
  return <CriterianAssessment data={data as any} id={user?.id} />
}
