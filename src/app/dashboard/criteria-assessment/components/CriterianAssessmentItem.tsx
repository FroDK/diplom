import cn from 'classnames'

import styles from './styles.module.scss'
import { Button, Typography } from 'antd'
import { Key, SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IBattle } from '../../criteria-form/page/CriteriaFormPage'

const CriterionAssessmentItem = ({data, id}: {data: IBattle, id: string}) => {
  const colorStatus = data.status === 'in_progress' ? '#4DCB4A' : data.status === 'completed' ? '#CB4A69' : '#d9d9d9'
  const [chairman, setChairman] = useState('')
  const router = useRouter()

  useEffect(() => {
    data?.users.forEach((item) => {
      if (item.id === id) {
        setChairman(item.fio!)
      }
    })

  }, [data.users, id])

  const handleClick = (id: string) => {
    localStorage.setItem('criteria-form-id', JSON.stringify(id))
    localStorage.setItem('criteria-id', JSON.stringify(data.id))
    router.push('/dashboard/criteria-form')
  }

  const classNames = cn(styles.item, data.status === 'completed' && styles.finished)

  const disabled = data.status === 'completed' || data.status === 'not_start'

  return (
    <div className={classNames}>
      <div className={styles.info}>
        {/* <Typography
          style={{
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >
          {date}
        </Typography> */}
        <Typography
          style={{
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >{`Председатель жюри: ${chairman || 'нет данных'}`}</Typography>
        <Typography
          style={{
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >{`Вид: ${data?.kind_of_contest || 'нет данных'}`}</Typography>
        <Typography
          style={{
            fontSize: '10px',
            color: colorStatus,
          }}
        >
          {data?.status === 'completed'
            ? 'Завершена'
            : data.status === 'in_progress'
            ? 'В процессе'
            : 'Не начата'}
        </Typography>
      </div>
      <Typography
        style={{
          fontSize: '16px',
          fontWeight: '700',
        }}
        className={styles.title}
      >
        {data.title}
      </Typography>
      <div className={styles.modules}>
        <div className={styles.module}>
          {data.form.length > 0 && data.form.map((item: { criteriaForm: { id: Key | null | undefined }[]; title: any }) => (
            <div key={item.criteriaForm[0].id} className={styles.moduleItem}>
              <Typography>{`${item.title}:`}</Typography>
              <Button className={styles.button} onClick={() => handleClick(item.criteriaForm[0].id as string)} disabled={disabled}>
                Оценить
              </Button>
            </div>
          ))}
          {data.form.length === 0 && (
            <Typography>Дождитесь появления форм для оценки</Typography>
          )}
        </div>
      </div>
    </div>
  )
}

export default CriterionAssessmentItem
