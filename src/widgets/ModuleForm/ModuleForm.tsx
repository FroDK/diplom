'use client'

import styles from './styles.module.scss'
import { Button, Input, Radio, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { FC, useState } from 'react'
import IconX from '@/ui/icons/IconX'
import PageWrapper from '@/lib/components/PageWrapper'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { uuid } from '@supabase/gotrue-js/dist/module/lib/helpers'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/init/providers/supabase-provider'

interface IMarks {
  id: string
  value: string
}

interface IForm {
  title: string
  description: string
}

export interface ICriteriaForm {
  id: string
  criteriaDescription: string
  criteriaName: string
  marks: IMarks[]
  type: 'subject' | 'object'
}

const ModuleForm: FC = () => {
  const router = useRouter()
  const { supabase } = useSupabase()

  const edit = JSON.parse(localStorage.getItem('edit') as string)
  const editableId = JSON.parse(localStorage.getItem('editable_form') as string)
  const editableForm = JSON.parse(
    localStorage.getItem('championShips') as string
  )
  const currentIndex = editableForm.findIndex(
    (item: { id: any }) =>
      item.id ===
      JSON.parse(localStorage.getItem('current_battle_for_form') as string)
  )
  const editableIndex = editableForm[currentIndex]?.form?.findIndex(
    (item: { criteriaForm: { id: any }[] }) =>
      item.criteriaForm[0].id === editableId
  )

  const [{ title, description }, setForm] = useState<IForm>(
    edit
      ? {
          title: editableForm[currentIndex]?.form[editableIndex].title,
          description:
            editableForm[currentIndex]?.form[editableIndex].description,
        }
      : {
          title: '',
          description: '',
        }
  )

  const [criteriaForm, setCriteriaForm] = useState<ICriteriaForm[]>(
    edit
      ? editableForm[currentIndex]?.form[editableIndex].criteriaForm
      : [
          {
            id: uuid(),
            criteriaDescription: '',
            criteriaName: '',
            marks: [],
            type: 'object',
          },
        ]
  )

  const onCheckboxChange = (e: CheckboxChangeEvent, id: string) => {
    const index = criteriaForm.findIndex((item) => item.id === id)

    const newObj = { ...criteriaForm[index], type: e.target.value }

    const newArr = [
      ...criteriaForm.slice(0, index),
      newObj,
      ...criteriaForm.slice(index + 1),
    ]

    setCriteriaForm(newArr)
  }

  const onDescriptionChange = ({
    target: { name, value },
  }: {
    target: { name: string; value: string }
  }) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const onChange = (
    id: string,
    {
      target: { name, value },
    }: {
      target: { name: string; value: string }
    }
  ) => {
    const index = criteriaForm.findIndex((item) => item.id === id)

    const newObj = { ...criteriaForm[index], [name]: value }

    const newArr = [
      ...criteriaForm.slice(0, index),
      newObj,
      ...criteriaForm.slice(index + 1),
    ]
    setCriteriaForm(newArr)
  }

  const onCriteriaMarksChange = (
    id: string,
    {
      target: { name, value },
    }: {
      target: { name: string; value: string }
    }
  ) => {
    let marks: ICriteriaForm = {
      id: '',
      criteriaDescription: '',
      criteriaName: '',
      marks: [],
      type: 'object',
    }

    criteriaForm.forEach((item) => {
      for (let i = 0; i < item.marks.length; i++) {
        if (item.marks[i].id === id) {
          marks = item
        }
      }
    })

    const indexMarks = marks.marks.findIndex((item) => item.id === id)

    const index = criteriaForm.findIndex((item) => item.id === marks.id)

    const newObj = {
      ...criteriaForm[index],
      marks: [
        ...criteriaForm[index].marks.slice(0, indexMarks),
        { id, value },
        ...criteriaForm[index].marks.slice(indexMarks + 1),
      ],
    }

    const newArr = [
      ...criteriaForm.slice(0, index),
      newObj,
      ...criteriaForm.slice(index + 1),
    ]

    setCriteriaForm(newArr)
  }

  const onAddVariant = (id: string) => {
    const index = criteriaForm.findIndex((item) => item.id === id)

    const newObj = {
      ...criteriaForm[index],
      marks: [...criteriaForm[index].marks, { id: uuid(), value: '' }],
    }

    const newArr = [
      ...criteriaForm.slice(0, index),
      newObj,
      ...criteriaForm.slice(index + 1),
    ]

    setCriteriaForm(newArr)
  }

  const onDeleteVariant = (id: string) => {
    let marks: ICriteriaForm = {
      id: '',
      criteriaDescription: '',
      criteriaName: '',
      marks: [],
      type: 'object',
    }

    criteriaForm.forEach((item) => {
      for (let i = 0; i < item.marks.length; i++) {
        if (item.marks[i].id === id) {
          marks = item
        }
      }
    })

    const indexMarks = marks.marks.findIndex((item) => item.id === id)

    const index = criteriaForm.findIndex((item) => item.id === marks.id)

    const newObj = {
      ...criteriaForm[index],
      marks: [
        ...criteriaForm[index].marks.slice(0, indexMarks),
        ...criteriaForm[index].marks.slice(indexMarks + 1),
      ],
    }

    const newArr = [
      ...criteriaForm.slice(0, index),
      newObj,
      ...criteriaForm.slice(index + 1),
    ]

    setCriteriaForm(newArr)
  }

  const onSaveForm = async () => {
    const currentId = JSON.parse(
      localStorage.getItem('current_battle_for_form') as string
    )

    if (edit) {
      const form = editableForm[currentIndex].form

      const newObj = { title, description, criteriaForm, forId: currentId }

      const newForm = [
        ...form.slice(0, editableIndex),
        newObj,
        ...form.slice(editableIndex + 1),
      ]

      editableForm[currentIndex].form = newForm

      localStorage.setItem('championShips', JSON.stringify(editableForm))
      localStorage.setItem('edit', JSON.stringify(false))

      const { error } = await supabase
        .from('contest')
        // @ts-ignore
        .update({ form: editableForm[currentIndex].form })
        .eq('id', editableForm[currentIndex].id)

      router.push('/dashboard/my-championships')
      return
    }

    const battles = await JSON.parse(
      localStorage.getItem('championShips') as string
    )

    const index = battles.findIndex(
      (item: { id: string }) => item.id === currentId
    )

    const currentData = { title, description, criteriaForm, forId: currentId }

    const form =
      battles[index]?.form?.length !== 0 ? [...battles[index].form] : []

    form.push(currentData)

    battles[index].form = form

    localStorage.setItem('championShips', JSON.stringify(battles))

    const { error } = await supabase
      .from('contest')
      // @ts-ignore
      .update({ form: battles[index].form })
      .eq('id', battles[index].id)

    router.push('/dashboard/my-championships')
  }

  const onAddCriteria = () => {
    setCriteriaForm((prevForm) => [
      ...prevForm,
      {
        id: uuid(),
        criteriaDescription: '',
        criteriaName: '',
        marks: [],
        type: 'object',
      },
    ])
  }

  const onDeleteCriteria = (id: string) => {
    const newArr = criteriaForm.filter((item) => item.id !== id)

    setCriteriaForm(newArr)
  }

  const RightHeader = () => (
    <div className={styles.buttons}>
      <Button onClick={onAddCriteria} className={styles.leftButton}>
        + Добавить критерий
      </Button>
      <Button onClick={onSaveForm}>Сохранить форму</Button>
    </div>
  )

  return (
    <PageWrapper title=" " headerRight={<RightHeader />}>
      <div className={styles.moduleForm}>
        <div className={styles.name}>
          <Typography className={styles.title}>Название формы</Typography>
          <Input
            onChange={onDescriptionChange}
            name="title"
            value={title}
            style={{
              width: '418px',
            }}
          />
        </div>
        <div className={styles.name}>
          <Typography className={styles.title}>Описание формы</Typography>
          <TextArea
            onChange={onDescriptionChange}
            value={description}
            name="description"
            style={{
              width: '418px',
            }}
          />
        </div>
      </div>

      {criteriaForm?.map((item) => {
        return (
          <div key={item.id} className={styles.criteriaForm}>
            <div className={styles.name}>
              <Typography className={styles.title}>
                Наименование критерия
              </Typography>
              <TextArea
                onChange={(e) => onChange(item.id, e)}
                value={item.criteriaName}
                name="criteriaName"
                style={{
                  width: '418px',
                }}
              />
            </div>
            <div className={styles.name}>
              <Typography className={styles.title}>
                Описание критерия:
              </Typography>
              <Input
                onChange={(e) => onChange(item.id, e)}
                value={item.criteriaDescription}
                name="criteriaDescription"
                style={{
                  width: '418px',
                }}
              />
            </div>
            <div className={styles.name}>
              <Typography className={styles.title}>Вид оценки</Typography>
              <Radio.Group
                defaultValue={'object'}
                onChange={(e) => onCheckboxChange(e, item.id)}
                value={item.type}
              >
                <Radio value={'subject'}>Субъективный</Radio>
                <Radio value={'object'}>Объективный</Radio>
              </Radio.Group>
            </div>

            {item.marks.length > 0 && (
              <div className={styles.criteriaList}>
                <Typography style={{ display: 'block', margin: '0 auto' }}>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Введите оценки в числовом формате. Дробные числа - через "."
                  (Например: 0.1)
                </Typography>
                {item.marks.map((item, i) => {
                  return (
                    <div key={item.id} className={styles.item}>
                      <Typography className={styles.title}>{`Вариант оценки ${
                        i + 1
                      }:`}</Typography>
                      <div className={styles.input}>
                        <Input
                          required
                          name={item.value}
                          style={{
                            width: '418px',
                          }}
                          value={item.value}
                          onChange={(e) => onCriteriaMarksChange(item.id, e)}
                        />
                        <IconX onClick={() => onDeleteVariant(item.id)} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className={styles.sideButtons}>
              <Button
                onClick={() => onDeleteCriteria(item.id)}
                className={styles.delete}
              >
                Удалить критерий
              </Button>
              <Button
                onClick={() => onAddVariant(item.id)}
                className={styles.add}
              >
                + Вариант оценки
              </Button>
            </div>
          </div>
        )
      })}
    </PageWrapper>
  )
}

export default ModuleForm
