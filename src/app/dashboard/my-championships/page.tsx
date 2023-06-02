'use client'

import PageWrapper from '@/lib/components/PageWrapper'
import CreateBattleComponent from './components/CreateBattleComponent'

const mok = [
  {
    id: 1,
    name: 'Битва маркетологов',
    status: 'В процессе',
  },
  {
    id: 2,
    name: 'Битва титанов',
    status: 'Завершено',
  },
]

export default async function Profile() {
  return (
    <PageWrapper title="Мои Чемпионаты">
      <div>
        {mok.map((item, i) => {
          return (
            <CreateBattleComponent
              title={item.name}
              status={item.status}
              id={item.id}
              key={i}
            />
          )
        })}
      </div>
    </PageWrapper>
  )
}
