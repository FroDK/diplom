'use client'

import PageWrapper from '@/lib/components/PageWrapper'
import { Button, Input, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import Image from 'next/image'
import image from './images/photo.png'
import { useSupabase } from '@/init/providers/supabase-provider'
import AddSelect from '@/lib/components/AddSelect/AddSelect'

interface IForm {
  fio: string
  phone: string
  email: string
  description: string
  qualities: string[] | null
}

export const Profile = (props: any) => {
  const [{ fio, phone, email, description, qualities }, setForm] =
    useState<IForm>({
      fio: '',
      phone: '',
      email: '',
      description: '',
      qualities: null,
    })

  const [isSave, setIsSave] = useState(false)
  const [isCancel, setIsCancel] = useState(false)

  const { supabase } = useSupabase()

  const handleChange = ({
    target: { name, value },
  }: {
    target: { name: string; value: string }
  }) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
    isSave === false && setIsSave(true)
  }

  const handleSelectChange = (value: string[]) => {
    console.log(value)
    isSave === false && setIsSave(true)
    setForm((prevForm) => ({ ...prevForm, qualities: value }))
  }

  const onSave = async () => {
    setIsSave(false)
    const { data, error } = await supabase
      .from('users')
      .update({
        email,
        phone,
        description,
        fio,
        qualities,
      })
      .match({ id: props?.data?.id })
  }

  const onCancel = () => {
    setIsSave(false)
    setIsCancel(true)
  }

  useEffect(() => {
    const showUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .match({ id: props?.data?.id })

      data &&
        setForm({
          fio: data[0]?.fio!,
          phone: data[0]?.phone!,
          email: data[0]?.email!,
          description: data[0]?.description!,
          qualities: data[0]?.qualities!,
        })
    }

    setIsCancel(false)

    showUser()
  }, [props?.data?.id, supabase, isCancel])

  return (
    <PageWrapper title="Моя страница">
      <div className={styles.card}>
        <Image className={styles.image} src={image} alt="" />
        <div className={styles.content}>
          <div className={styles.input}>
            <Typography
              style={{
                fontSize: '16px',
              }}
            >
              ФИО:
            </Typography>
            <Input
              value={fio}
              name={'fio'}
              onChange={handleChange}
              style={{ width: 418 }}
            />
          </div>
          <div className={styles.input}>
            <Typography
              style={{
                fontSize: '16px',
              }}
            >
              Телефон:
            </Typography>
            <Input
              value={phone}
              name={'phone'}
              onChange={handleChange}
              style={{ width: 418 }}
            />
          </div>
          <div className={styles.input}>
            <Typography
              style={{
                fontSize: '16px',
              }}
            >
              E-mail:
            </Typography>
            <Input
              value={email}
              name={'email'}
              disabled
              onChange={handleChange}
              style={{ width: 418 }}
            />
          </div>
          <div className={styles.input}>
            <Typography
              style={{
                fontSize: '16px',
              }}
            >
              О себе:
            </Typography>
            <TextArea
              value={description}
              name={'description'}
              onChange={handleChange}
              placeholder="Расскажите о себе, хобби, интересы и тд."
              style={{ width: 418 }}
            />
          </div>
          <div className={styles.properties}>
            <div className={styles.group}>
              <Typography
                style={{
                  fontSize: '16px',
                  width: '90px',
                }}
              >
                Свойства:
              </Typography>
              <AddSelect values={qualities} onChange={handleSelectChange} />
            </div>
            <div className={styles.props}>
              {qualities &&
                qualities.map((item, i) => {
                  return (
                    <Typography
                      style={{
                        fontSize: '16px',
                      }}
                      key={i}
                      className={styles.groupItem}
                    >
                      {item}
                    </Typography>
                  )
                })}
            </div>
          </div>
        </div>
        {isSave && (
          <div className={styles.buttons}>
            <Button className={styles.save} onClick={onSave}>
              Сохранить
            </Button>
            <Button onClick={onCancel}>Отменить</Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
