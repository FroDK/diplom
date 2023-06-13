'use client'

import { Button, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import { SetStateAction, useEffect, useState } from 'react'
import IconRight from '@/ui/icons/IconRight'
import { useSupabase } from '@/init/providers/supabase-provider'

interface IStepOneProps {
  data: any
  onChange: (value: ITeams | undefined) => void
  onChangeStep: (value: string) => void
  value: string
}

export interface ITeams {
  contest: string
  id: string
  name: string
}

const StepOne = ({ data, onChange, onChangeStep, value }: IStepOneProps) => {
  const [stepOneForm, setStepOneForm] = useState<string>('')
  const [criteriaFormId, setCriteriaFormId] = useState('')
  const [teams, setTeams] = useState<ITeams[] | undefined>(undefined)
  let title
  let description

  const { supabase } = useSupabase()

  useEffect(() => {
    setCriteriaFormId(
      JSON.parse(localStorage.getItem('criteria-form-id') as string)
    )
  }, [])

  useEffect(() => {
    const getTeams = async () => {
      const formId = JSON.parse(localStorage.getItem('criteria-id') as string)

      const { data } = await supabase.from('team').select()

      const newArr = data?.filter((item) => item.contest === formId)

      console.log(formId)

      setTeams(newArr)
    }

    getTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  data &&
    data[0].form.forEach(
      (item: {
        criteriaForm: { id: string }[]
        title: SetStateAction<string>
        description: SetStateAction<string>
      }) => {
        if (item.criteriaForm[0].id === criteriaFormId) {
          title = item.title
          description = item.description
        }
      }
    )

  const handleChange = (value: string) => {
    setStepOneForm(value)

    const index = teams?.findIndex((item) => item.name === value) as number

    onChange(teams && teams[index])
  }

  return (
    <div className={styles.container}>
      <Typography
        style={{
          fontSize: '18px',
          fontWeight: '700',
        }}
      >
        {title}
      </Typography>
      <Typography
        className={styles.title}
        style={{
          fontSize: '14px',
        }}
      >
        {description}
      </Typography>
      <Typography
        className={styles.step}
        style={{
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        Шаг 1.
      </Typography>
      <div className={styles.input}>
        <Typography
          style={{
            fontSize: '14px',
          }}
        >
          Выберите команду для оценки:
        </Typography>
        <Select
          onChange={handleChange}
          value={value}
          style={{
            width: 258,
          }}
          options={teams?.map((item) => ({
            label: item.name,
            name: item.name,
            value: item.name,
          }))}
        />
        <Button
          style={{
            background: '#758FEA',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
          }}
          onClick={() => onChangeStep('next')}
        >
          {`Далее`} {<IconRight />}
        </Button>
      </div>
    </div>
  )
}

export default StepOne
