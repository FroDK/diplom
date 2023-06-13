'use client'

import cn from 'classnames'

import styles from './styles.module.scss'
import { Button, Typography } from 'antd'
import IconBasket from '@/ui/icons/IconBasket'
import { ICreateBattleComponentProps } from './types'
import { useRouter } from 'next/navigation'
import { Key, useState } from 'react'
import { useSupabase } from '@/init/providers/supabase-provider'
import { IBattle } from '../../criteria-form/page/CriteriaFormPage'

const CreateBattleComponent = ({
  title,
  battleId,
  status,
}: ICreateBattleComponentProps) => {
  const [battlesState, setBattlesState] = useState(
    JSON.parse(localStorage.getItem('championShips') as string)
  )
  const { supabase } = useSupabase()
  const router = useRouter()
  const colorStatus =
    status === 'in_progress'
      ? '#4DCB4A'
      : status === 'completed'
      ? '#CB4A69'
      : '#d9d9d9'
  const index = battlesState.findIndex(
    (item: { id: string | number }) => item.id === battleId
  )

  const handleDelete = async (id: string) => {
    if (status !== 'completed') {
      const battles: IBattle[] = await JSON.parse(
        localStorage.getItem('championShips') as string
      )
      const currentId = await JSON.parse(
        localStorage.getItem('current_battle_for_form') as string
      )

      const index = battles.findIndex((item) => item.id === currentId)

      const criteriaIndex = battles[index].form.findIndex(
        (item) => item.criteriaForm[0].id === id
      )

      const newArr = [
        ...battles[index].form.slice(0, criteriaIndex),
        ...battles[index].form.slice(criteriaIndex + 1),
      ]

      battles[index].form = newArr

      localStorage.setItem('championShips', JSON.stringify(battles))
      setBattlesState(battles)

      const { error } = await supabase
        .from('contest')
        // @ts-ignore
        .update({ form: battles[index].form })
        .eq('id', battles[index].id)
    }
  }

  const handleMouseEnter = async () => {
    localStorage.setItem('current_battle_for_form', JSON.stringify(battleId))
  }

  const handleEdit = (id: string) => {
    localStorage.setItem('current_battle_for_form', JSON.stringify(battleId))
    localStorage.setItem('editable_form', JSON.stringify(id))
    localStorage.setItem('edit', JSON.stringify(true))
    router.push('/dashboard/create-form')
  }

  const onAddForm = () => {
    localStorage.setItem('current_battle_for_form', JSON.stringify(battleId))
    localStorage.setItem('edit', JSON.stringify(false))
    router.push('/dashboard/create-form')
  }

  return (
    <div
      className={cn(styles.wrapper, status === 'completed' && styles.finished)}
    >
      <div className={styles.header}>
        <div className={styles.about}>
          <Typography
            style={{
              fontSize: '16px',
              fontWeight: '600',
            }}
            className={styles.title}
          >
            {title}
          </Typography>
          <Typography
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: colorStatus,
            }}
            className="status"
          >
            {status === 'completed'
              ? 'Завершена'
              : status === 'in_progress'
              ? 'В процессе'
              : 'Не начата'}
          </Typography>
        </div>
        <Button onClick={onAddForm} disabled={status === 'completed'}>
          + Добавить форму
        </Button>
      </div>

      <div className={styles.modules}>
        {battlesState[index]?.form?.map(
          (
            item: { title: any; criteriaForm: { id: string }[] },
            i: Key | null | undefined
          ) => {
            return (
              <div key={i} className={styles.item}>
                <Typography
                  style={{
                    fontSize: '14px',
                    width: '80px',
                  }}
                >
                  {' '}
                  {`${item.title}:`}
                </Typography>
                <div className={styles.buttons}>
                  <Button
                    className={styles.button}
                    onClick={() => handleEdit(item.criteriaForm[0].id)}
                    disabled={status === 'completed'}
                  >
                    Редактировать
                  </Button>
                  <IconBasket
                    onMouseEnter={handleMouseEnter}
                    onClick={() => handleDelete(item.criteriaForm[0].id)}
                  />
                </div>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}

export default CreateBattleComponent
