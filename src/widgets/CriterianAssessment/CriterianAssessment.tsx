'use client'

import PageWrapper from '@/lib/components/PageWrapper'

import styles from './styles.module.scss'
import CriterionAssessmentItem from '@/app/dashboard/criteria-assessment/components/CriterianAssessmentItem'
import { useEffect, useState } from 'react'
import { IFormCriteria } from '@/app/dashboard/my-championships/components/types'
import { useSupabase } from '@/init/providers/supabase-provider'
import { IBattle } from '@/app/dashboard/criteria-form/page/CriteriaFormPage'

export interface IForm {
  id: number | string
  name: string
}

export interface IMok {
  mok: ICriteriaAssessmentProps[]
}

export interface ICriteriaAssessmentProps {
  address: string
  city: string
  country: string
  description: string
  id: string
  kind_of_contest: string
  status: string
  title: string
  type_contest: string
  form: IFormCriteria[]
}

export default function CriteriaAssessment({
  data,
  id,
}: {
  data: IBattle[]
  id: string | undefined
}) {
  const { supabase } = useSupabase()
  const [championShips, setChampionShips] =
    useState<IBattle[]>()

  useEffect(() => {
    const newArr: IBattle[] = data.filter((d) => d.users.some(a => a.id === id))

    const sortArr: IBattle[] = [...newArr].sort((a) => {
      return a.status === 'completed' ? 1 : -1
    })

    setChampionShips(sortArr)
  }, [data, id, supabase])

  return (
    <PageWrapper title="Критериальная оценка">
      <div className={styles.container}>
        {championShips?.map(
            (item) => {
              return (
                <CriterionAssessmentItem key={item.id} data={item} id={id!}/>
              )
            }
          )}
      </div>
    </PageWrapper>
  )
}
