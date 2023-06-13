'use client'

import { memo, useEffect, useState } from 'react'
import StepOne, {
  ITeams,
} from '../../criteria-assessment/components/step-one/StepOne'
import StepTwo from '../../criteria-assessment/components/StepTwo/StepTwo'
import StepThree from '../../criteria-assessment/components/StepThree/StepThree'
import SuccessCard from '@/lib/components/SuccessCard/SuccessCard'
import { IFormCriteria } from '../../my-championships/components/types'
import { useSupabase } from '@/init/providers/supabase-provider'

import styles from './styles.module.scss'

export interface IUsers {
  email: string
  fio: string
  id: string
  user_role: string
}

export interface ITypeContest {
  id: string
  name: string
}

interface ITeamMarks {
  team: string
  rates: number
}

export interface IForm {
  rateUser: IUsers[]
  teamMarks: ITeamMarks[]
}

interface IStateForm {
  rateUser: IUsers[]
  team: string
  rates: number
}

export interface IBattle {
  address: string
  city: string
  country: string
  created_at: string
  description: string
  form: IFormCriteria[]
  form_answers: IForm
  id: string
  kind_of_contest: string
  status: string
  title: string
  type_contest: ITypeContest
  users: IUsers[]
}

const CriteriaFormPage = ({ data, id }: { data: IBattle[]; id: string }) => {
  const { supabase } = useSupabase()

  const [criteriaFormId, setCriteriaFormId] = useState('')

  const [battle, setBattle] = useState<IBattle[] | undefined>(undefined)
  const [currentId, setCurrentId] = useState('')
  const [{ rateUser, team, rates }, setForm] = useState<IStateForm>({
    rateUser: [],
    team: '',
    rates: 0,
  })
  const [step, setStep] = useState(1)
  const [selectValue, setSelectValue] = useState('')
  const [stepTwoFormAnswers, setStepTwoFormAnswers] = useState<string[] | {}>(
    {}
  )
  const [stepThreeFormAnswers, setStepThreeFormAnswers] = useState<
    string[] | {}
  >({})

  const [isFinish, setIsFinish] = useState(false)

  useEffect(() => {
    const criteriaId = JSON.parse(localStorage.getItem('criteria-id') as string)
    const newArr = data.filter((item) => item.id === criteriaId)
    setCurrentId(JSON.parse(localStorage.getItem('criteria-id') as string))

    setCriteriaFormId(
      JSON.parse(localStorage.getItem('criteria-form-id') as string)
    )

    localStorage.setItem('championShips', JSON.stringify(data))

    setBattle(newArr)
  }, [data, id])

  useEffect(() => {
    let rateId: number
    battle &&
      battle[0].form_answers?.teamMarks.forEach((item) => {
        if (item.team === team) {
          rateId === item.rates
        }
      })

    const rate = rateId!

    if (rate) {
      setForm((prevForm) => ({ ...prevForm, rates: rate }))
    }

    const users =
      battle && battle[0].users.filter((item) => item.user_role === 'expert')

    if (users) {
      setForm((prevForm) => ({ ...prevForm, rateUser: users }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle])

  const handleChangeTeam = (value: ITeams | undefined) => {
    setForm((prevState) => ({ ...prevState, team: value?.id as string }))
    setSelectValue(value?.name as string)
  }

  const handleChangeFormStepTwo = (criteria: string, value: string) => {
    setStepTwoFormAnswers((prevState) => ({ ...prevState, [criteria]: value }))
  }

  const handleChangeStep = (direction: string) => {
    if (direction === 'next') {
      setStep((prevState) => prevState + 1)
    } else {
      setStep((prevState) => prevState - 1)
    }
  }

  const handleFinishStepThreeForm = (criteria: string, value: string) => {
    setStepThreeFormAnswers((prevState) => ({
      ...prevState,
      [criteria]: value,
    }))
  }

  const handleFinishStepThree = async () => {
    let rate: number = rates

    for (let key in stepTwoFormAnswers) {
      // @ts-ignore
      rate += +stepTwoFormAnswers[key]
    }

    for (let key in stepThreeFormAnswers) {
      // @ts-ignore
      rate += +stepThreeFormAnswers[key]
    }

    const result = +rate.toFixed(1)

    setForm((prevForm) => ({ ...prevForm, rates: result }))

    setIsFinish(true)
  }

  useEffect(() => {
    if (isFinish) {
      const fetchForm = async () => {
        const { data } = await supabase
          .from('contest')
          .select('form_answers')
          .eq('id', currentId)

        const index =
          battle &&
          battle[0].form.findIndex(
            (item) => item.criteriaForm[0].id === criteriaFormId
          )

        const title = battle && battle[0].form[index!].title

        const newObj = battle &&
          data && {
            ...data[0].form_answers!,
            rateUser,
            teamMarks: [
              // @ts-ignore
              ...data[0].form_answers?.teamMarks,
              { title, team, rates },
            ],
          }

        const sendForm = async () => {
          const { error } = await supabase
            .from('contest')
            // @ts-ignore
            .update({ form_answers: newObj })
            .eq('id', currentId)
        }

        sendForm()
      }

      fetchForm()
    }

    setIsFinish(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinish, supabase])

  const onMore = () => {
    setStep(1)
    setStepThreeFormAnswers({})
    setStepTwoFormAnswers({})
    setForm((prevForm) => ({ ...prevForm, rates: 0 }))
  }

  return (
    <>
      {step === 1 && (
        <StepOne
          value={selectValue}
          onChangeStep={handleChangeStep}
          onChange={handleChangeTeam}
          data={battle!}
        />
      )}
      {step === 2 && (
        <StepTwo
          values={stepTwoFormAnswers}
          onChange={handleChangeFormStepTwo}
          formId={criteriaFormId}
          onChangeStep={handleChangeStep}
          data={battle!}
        />
      )}
      {step === 3 && (
        <StepThree
          values={stepThreeFormAnswers}
          data={battle!}
          formId={criteriaFormId}
          onChangeStep={handleChangeStep}
          onChange={handleFinishStepThreeForm}
          onFinish={handleFinishStepThree}
        />
      )}
      {step === 4 && (
        <SuccessCard
          leftTitleButton="Отправить еще один ответ"
          rightTitleButton="Вернуться на главную"
          leftButtonClassName={styles.leftIcon}
          rightButtonClassName={styles.rightIcon}
          title="Данные успешно отправлены!"
          description="Теперь пора оценить другую команду :)"
          handleClick={onMore}
        />
      )}
    </>
  )
}

export default CriteriaFormPage
