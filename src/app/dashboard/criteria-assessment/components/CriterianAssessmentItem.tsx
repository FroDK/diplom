import cn from 'classnames'

import styles from './styles.module.scss'
import { Button, Typography } from 'antd'
import { useRouter } from 'next/router'

interface ICriterionAssessmentItemProps {
  status?: string
  chairman?: string
  kind?: string
  date?: string
  title?: string
  id?: number
}

const CriterionAssessmentItem = ({
  status,
  chairman,
  kind,
  date,
  title,
  id,
}: ICriterionAssessmentItemProps) => {
  const colorStatus = (status === 'В процессе' ? '#4DCB4A' : '#CB4A69')
  // const router = useRouter()

  const handleClick = () => {
    // router.push('/step-one')
  }

  const classNames = cn(styles.item, status === 'Завершено' && styles.finished)

  const disabled = status === 'Завершено' && true

  return (
    <div className={classNames}>
      <div className={styles.info}>
        <Typography
          style={{
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >
          {date}
        </Typography>
        <Typography
          style={{
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >{`Председатель жюри: ${chairman}`}</Typography>
        <Typography
          style={{
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >{`Вид: ${kind}`}</Typography>
        <Typography
          style={{
            fontSize: '10px',
            color: colorStatus
          }}
        >
          {status}
        </Typography>
      </div>
      <Typography
        style={{
          fontSize: '16px',
          fontWeight: '700',
        }}
        className={styles.title}
      >
        {title}
      </Typography>
      <div className={styles.modules}>
        <div className={styles.module}>
          <div className={styles.moduleItem}>
            <Typography>Модуль А:</Typography>
            <Button onClick={handleClick} disabled={disabled}>
              Оценить
            </Button>
          </div>
          <div className={styles.moduleItem}>
            <Typography>Модуль B:</Typography>
            <Button onClick={handleClick} disabled={disabled}>
              Оценить
            </Button>
          </div>
          <div className={styles.moduleItem}>
            <Typography>Модуль C:</Typography>
            <Button onClick={handleClick} disabled={disabled}>
              Оценить
            </Button>
          </div>
        </div>
        <div className={styles.module}>
          <div className={styles.moduleItem}>
            <Typography>Модуль D:</Typography>
            <Button onClick={handleClick} disabled={disabled}>
              Оценить
            </Button>
          </div>
          <div className={styles.moduleItem}>
            <Typography>Модуль E:</Typography>
            <Button onClick={handleClick} disabled={disabled}>
              Оценить
            </Button>
          </div>
          <div className={styles.moduleItem}>
            <Typography>Модуль F:</Typography>
            <Button onClick={handleClick} disabled={disabled}>
              Оценить
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CriterionAssessmentItem
