import ChampionShips from "@/widgets/ChampionShips/ChampionShips";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

export default async function MyChampionShips() {
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

  return (<ChampionShips id={user?.id} data={data} />)
}
