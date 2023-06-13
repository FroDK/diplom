import { Button, Form, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import IconRight from '@/ui/icons/IconRight'
import IconLeft from '@/ui/icons/IconLeft'
import { useEffect, useState } from 'react'
import { IBattle } from '@/app/dashboard/criteria-form/page/CriteriaFormPage'

export interface IMarks {
  id: string
  value: string
}

export interface IFormData {
  id: string
  criteriaName: string
  criteriaDescription: string
  marks: IMarks[]
  type: string
}

interface IStepTwoProps {
  onChangeStep: (value: string) => void
  data: IBattle[]
  formId: string
  values: string[] | {}
  onChange: (criteria: string, value: string) => void
}

// @ts-ignore
// @ts-ignore
// @ts-ignore
const StepTwo = ({
  onChangeStep,
  data,
  formId,
  values,
  onChange,
}: IStepTwoProps) => {
  const [formsData, setFormsData] = useState<IFormData[]>([])
  const [answers, setAnswers] = useState<string[] | {}>({})

  useEffect(() => {
    setAnswers(values)

    const filterArr = data[0].form.filter((item) =>
      item.criteriaForm.some((a) => a.type === 'object')
    )

    const index = filterArr.findIndex((item) =>
      item.criteriaForm.some((a) => a.id === formId)
    )

    filterArr &&
      setFormsData(
        filterArr[index]?.criteriaForm.filter((item) => item.type === 'object')
      )
  }, [data, formId, values])

  const onFinish = () => {
    onChangeStep('next')
  }

  const handleChange = (value: string, criteria: string) => {
    setAnswers((prevState) => ({ ...prevState, [criteria]: value }))

    onChange(criteria, value)
  }

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
      <Form onFinish={onFinish} className={styles.list}>
        {formsData?.map(
          ({ criteriaDescription, criteriaName, id, marks }, i) => {
            // @ts-ignore
            const answer = answers && answers[criteriaName]
            return (
              <div key={id} className={styles.item}>
                <Typography
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  className={styles.name}
                >
                  {`${i + 1}. ${criteriaName}`}
                </Typography>
                <Form.Item
                  valuePropName={answer}
                  name={criteriaName}
                  style={{ marginBottom: '0' }}
                >
                  <Select
                    defaultValue={marks[0]}
                    value={answer}
                    onChange={(value) => handleChange(value, criteriaName)}
                    style={{ width: 128 }}
                    options={marks.map((item) => ({
                      name: item.value,
                      value: item.value,
                      label: item.value,
                    }))}
                  />
                </Form.Item>
                <Typography
                  color={'#A5A5A5'}
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {criteriaDescription}
                </Typography>
              </div>
            )
          }
        )}
        {formsData?.length === 0 ||
          (!formsData && (
            <Typography style={{ fontSize: '20px' }}>
              Нет объективных критериев для оценки. Проследуйте на следующий
              этап.
            </Typography>
          ))}

        <div className={styles.buttons}>
          <Button
            onClick={() => onChangeStep('back')}
            className={styles.leftIcon}
          >
            {<IconLeft />} {`Назад`}
          </Button>
          <Form.Item
            style={{
              marginBottom: '0',
            }}
          >
            <Button
              htmlType="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                color: '#fff',
                background: '#758FEA',
              }}
            >
              {`Далее`} {<IconRight />}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default StepTwo
