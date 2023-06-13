import { Button, Form, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import IconLeft from '@/ui/icons/IconLeft'
import IconRight from '@/ui/icons/IconRight'
import { useEffect, useState } from 'react'
import { IFormData, IMarks } from '../StepTwo/StepTwo'
import { IBattle } from '@/app/dashboard/criteria-form/page/CriteriaFormPage'
import { IForm } from '@/widgets/CriterianAssessment/CriterianAssessment'

export interface IData {
  criteriaForm: IForm[]
  description: string
  forId: string
  title: string
}

interface IStepThreeProps {
  onChangeStep: (value: string) => void
  data: IBattle[]
  formId: string
  onChange: (criteria: string, value: string) => void
  values: string[] | {}
  onFinish: () => void
}

// @ts-ignore
const StepThree = ({
  onChangeStep,
  data,
  formId,
  onChange,
  values,
  onFinish,
}: IStepThreeProps) => {
  const [formsData, setFormsData] = useState<IFormData[]>([])
  const [answers, setAnswers] = useState<string[] | {}>({})

  useEffect(() => {
    setAnswers(values)

    const filterArr = data[0]?.form?.filter((item) =>
      item.criteriaForm.some((a) => a.type === 'subject')
    )

    const index = filterArr.findIndex((item) =>
      item.criteriaForm.some((a) => a.id === formId)
    )

    setFormsData(
      filterArr[index]?.criteriaForm.filter((item) => item.type === 'subject')
    )
  }, [data, formId, values])

  const handleFinish = () => {
    onFinish()
    onChangeStep('next')
  }

  const handleChange = (criteria: string, value: string) => {
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
        Шаг 3. Субъективная оценка от 3-х судей
      </Typography>
      <Form onFinish={handleFinish} className={styles.list}>
        {formsData?.map(({ criteriaName, id, marks }, i) => {
          // @ts-ignore
          const answerOne = answers && answers[`${criteriaName} ${1}`]
          // @ts-ignore
          const answerTwo = answers && answers[`${criteriaName} ${2}`]
          // @ts-ignore
          const answerThree = answers && answers[`${criteriaName} ${3}`]
          return (
            <div key={id} className={styles.wrapper}>
              <div className={styles.item}>
                <Typography
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  className={styles.name}
                >
                  {`${1}. ${criteriaName}`}
                </Typography>
                <Form.Item
                  valuePropName={answerOne}
                  style={{ marginBottom: '0' }}
                  name={`${criteriaName} ${1}`}
                >
                  <Select
                    defaultValue={marks[0]}
                    value={answerOne}
                    onChange={(value) =>
                      handleChange(`${criteriaName} ${1}`, value)
                    }
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
                  {'-- Судья 1'}
                </Typography>
              </div>
              <div className={styles.item}>
                <Typography
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  className={styles.name}
                >
                  {`${2}. ${criteriaName}`}
                </Typography>
                <Form.Item
                  valuePropName={answerTwo}
                  style={{ marginBottom: '0' }}
                  name={`${criteriaName} ${2}`}
                >
                  <Select
                    defaultValue={marks[0]}
                    value={answerTwo}
                    onChange={(value) =>
                      handleChange(`${criteriaName} ${2}`, value)
                    }
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
                  {'-- Судья 2'}
                </Typography>
              </div>
              <div className={styles.item}>
                <Typography
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  className={styles.name}
                >
                  {`${3}. ${criteriaName}`}
                </Typography>
                <Form.Item
                  valuePropName={answerThree}
                  style={{ marginBottom: '0' }}
                  name={`${criteriaName} ${3}`}
                >
                  <Select
                    defaultValue={marks[0]}
                    value={answerThree}
                    onChange={(value) =>
                      handleChange(`${criteriaName} ${3}`, value)
                    }
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
                  {'-- Судья 3'}
                </Typography>
              </div>
            </div>
          )
        })}
        {formsData?.length === 0 ||
          (!formsData && (
            <Typography style={{ fontSize: '20px' }}>
              Нет объективных критериев для оценки. Отправьте форму.
            </Typography>
          ))}

        <div className={styles.buttons}>
          <Button
            style={{ display: 'flex', alignItems: 'center', gap: '11px' }}
            onClick={() => onChangeStep('back')}
            className={styles.leftIcon}
          >
            {<IconLeft />} {`Назад`}
          </Button>
          <Form.Item style={{ marginBottom: '0' }}>
            <Button
              htmlType="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                background: '#758FEA',
                color: '#fff',
              }}
            >
              {`Отправить`} {<IconRight />}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default StepThree
