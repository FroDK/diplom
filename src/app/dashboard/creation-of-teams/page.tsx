import { CreationTeams } from '@/widgets/CreationTeams/CreationTeams'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'

const mok = [
  {
    id: 1,
    name: 'Битва маркетологов',
    chairman: 'Иванов Иван Иванович',
    date: '22.03.2023',
    type: 'Командный зачет',
    teams: [
      {
        name: 'Клуб Винкс. Школа Волшебниц',
        id: 1,
      },
      {
        name: 'Клуб Винкс',
        id: 2,
      },
    ],
    members: [
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: true,
        email: 'elvira_volkova_1988@yandex.ru',
      },
    ],
  },
  {
    id: 2,
    name: 'Битва таргетологов',
    chairman: 'Иванов Иван Иванович',
    date: '22.03.2023',
    type: 'Командный зачет',
    teams: [
      {
        name: 'Клуб Винкс. Школа Волшебниц',
        id: 1,
      },
      {
        name: 'Клуб Винкс',
        id: 2,
      },
    ],
    members: [
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: true,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
    ],
  },
]

export default async function CreationOfTeams() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const { data, error } = await supabase.from('contest_user').select(`
  *,
    auth.users(id)
  `)

  console.log(data)

  return (
    <>
      {mok.map((item, i) => (
        <CreationTeams
          id={item.id}
          name={item.name}
          chairman={item.chairman}
          date={item.date}
          type={item.type}
          teams={item.teams}
          members={item.members}
          key={i}
          mok={mok}
          user={item.members}
        />
      ))}
    </>
  )
}
