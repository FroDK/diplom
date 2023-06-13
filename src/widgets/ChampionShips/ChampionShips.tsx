'use client'

import PageWrapper from '@/lib/components/PageWrapper'
import { useEffect, useState } from 'react'
import CreateBattleComponent from '@/app/dashboard/my-championships/components/CreateBattleComponent'
import { IBattle, IUsers } from '@/app/dashboard/criteria-form/page/CriteriaFormPage'

export default function ChampionShips({data, id}: {data: any, id: string | undefined}) {
  const [contest, setContest] = useState<IBattle[]>([])

  useEffect(() => {
    const newArr: IBattle[] = data.filter((d: { users: IUsers[] }) => d.users.some(a => a.id === id))

    localStorage.setItem('championShips', JSON.stringify(newArr))

    const sortArr: IBattle[] = [...newArr].sort((a) => {
      return a.status === 'completed' ? 1 : -1
    })

    setContest(sortArr)
  }, [id, data])

  return (
    <PageWrapper title="Мои Чемпионаты">
      <div>
        {contest?.map((item, i) => {
          return (
            <CreateBattleComponent
              title={item.title}
              status={item.status}
              battleId={item.id}
              key={i}
              form={item.form}
            />
          )
        })}
      </div>
    </PageWrapper>
  )
}
