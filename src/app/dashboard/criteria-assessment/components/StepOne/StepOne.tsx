import { Button, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import { useState } from 'react'
import IconRight from '@/ui/icons/IconRight'

interface IStepOneProps {
  module?: string
  title?: string
  id?: number
  handleClick: (data: string) => void
}

const command = ['Заводные котята', 'Вторая команда', 'Еще команда']

const StepOne = ({
  module = 'A',
  title = 'Анализ информационного потенциальной целевой аудитории',
  id = 1,
  handleClick,
}: IStepOneProps) => {
  const [stepOneForm, setStepOneForm] = useState<string>('')

  const handleChange = (value: string) => {
    setStepOneForm(value)
  }

  return (
    <div className={styles.container}>
      <Typography
        style={{
          fontSize: '18px',
          fontWeight: '700',
        }}
      >{`Модуль ${module}`}</Typography>
      <Typography
        className={styles.title}
        style={{
          fontSize: '14px',
        }}
      >
        {title}
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
          style={{
            width: 258,
          }}
          options={command.map((item) => ({
            label: item,
            name: item,
            value: item,
          }))}
        />
        <Button onClick={() => handleClick(stepOneForm)}>
          {`Далее ${(<IconRight />)}`}
        </Button>
      </div>
    </div>
  )
}

export default StepOne
