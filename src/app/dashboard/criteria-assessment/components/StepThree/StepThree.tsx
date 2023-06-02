import { Button, Form, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import IconLeft from '@/ui/icons/IconLeft'
import IconRight from '@/ui/icons/IconRight'

const mok = [
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого. ',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- Судья 1',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого. ',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- Судья 2',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого. ',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- Судья 3',
  },
]

interface IStepThree {
  onNext?: () => void
  onPrev?: () => void
}

const StepThree = ({ onNext, onPrev }: IStepThree) => {
  return (
    <div className={styles.container}>
      <Typography
        style={{
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        Шаг 3. Субъективная оценка от 3-х судей
      </Typography>
      <Form className={styles.list}>
        {mok.map(({ name, rate, descr }, i) => {
          return (
            <div key={i} className={styles.item}>
              <Typography
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                className={styles.name}
              >
                {`${i + 1}. ${name}`}
              </Typography>
              <Select
                style={{ width: 128 }}
                options={rate.map((item) => ({
                  name: item,
                  value: item,
                  label: item,
                }))}
              />
              <Typography color={'#A5A5A5'} style={{
                fontWeight: '10px'
              }}>
                {descr}
              </Typography>
            </div>
          )
        })}

        <div className={styles.buttons}>
          <Button onClick={onPrev} className={styles.leftIcon}>
            {`Назад ${(<IconLeft />)}`}
          </Button>
          <Button onClick={onNext}>{`Отправить ${(<IconRight />)}`}</Button>
        </div>
      </Form>
    </div>
  )
}

export default StepThree
