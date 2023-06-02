"use client"

import PageWrapper from "@/lib/components/PageWrapper"

import styles from './styles.module.scss'
import CriterionAssessmentItem from "./components/CriterianAssessmentItem"

const mok = [
  {
    title: 'Битва маркетологов',
    status: 'В процессе',
    chairman: 'Иванов Иван Иванович',
    date: '22.03.2023',
    id: 1,
    kind: 'командный зачет',
  },
  {
    title: 'Битва маркетологов',
    status: 'Завершено',
    chairman: 'Сидоров Иван Иванович',
    date: '22.03.2023',
    id: 2,
    kind: 'командный зачет',
  },
  {
    title: 'Битва маркетологов',
    status: 'Завершено',
    chairman: 'Петров Иван Иванович',
    date: '22.03.2023',
    id: 3,
    kind: 'командный зачет',
  },
]

export default async function CriteriaAssessment() {
  return (
    <PageWrapper title="Критериальная оценка">
      <div className={styles.container}>
        {mok.map(({ chairman, date, id, kind, title, status }) => {
          return (
            <CriterionAssessmentItem
              chairman={chairman}
              date={date}
              id={id}
              kind={kind}
              status={status}
              title={title}
              key={id}
            />
          )
        })}
      </div>
    </PageWrapper>
  )
}
