import { Button, Form, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import IconRight from '@/ui/icons/IconRight'
import IconLeft from '@/ui/icons/IconLeft'

const mok = [
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 1],
    descr: '-- бинарный балл',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- максимально 0.3',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 1],
    descr: '-- бинарный балл',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- максимально 0.3',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 1],
    descr: '-- бинарный балл',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- максимально 0.3',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 1],
    descr: '-- бинарный балл',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 0.1, 0.2, 0.3],
    descr: '-- максимально 0.3',
  },
  {
    name: 'Представлено 3 самостоятельных фличарта. Вычесть по 0,1 за отсутствие каждого.',
    rate: [0, 1],
    descr: '-- бинарный балл',
  },
]

interface IStepTwoProps {
  handlePrev?: () => void
  handleClickStepTwoNext?: () => void
}

const StepTwo = ({ handlePrev, handleClickStepTwoNext }: IStepTwoProps) => {
  return (
    <div className={styles.container}>
      <Typography
        style={{
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        Шаг 2. Объективные оценки
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
              <Typography
                color={'#A5A5A5'}
                style={{
                  fontSize: '10px',
                }}
              >
                {descr}
              </Typography>
            </div>
          )
        })}

        <div className={styles.buttons}>
          <Button onClick={handlePrev} className={styles.leftIcon}>
            {`Назад ${(<IconLeft />)}`}
          </Button>
          <Button onClick={handleClickStepTwoNext}>
            {`Далее ${(<IconRight />)}`}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default StepTwo
