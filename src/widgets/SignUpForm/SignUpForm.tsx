'use client'

import React, { useEffect, useState } from 'react'
import { Button, Form, Input, notification, Typography } from 'antd'
import './index.css'
import Link from 'next/link'
import { NotificationInstance } from 'antd/es/notification/interface'
import { AuthError } from '@supabase/gotrue-js'
import { useSupabase } from '@/init/providers/supabase-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { ERoles } from '@/widgets/Dashboard/models/navItems'

type FormType = {
  anthroponym: string
  email: string
  password: string
  confirm: string
}

const openNotificationWithIcon = (
  api: NotificationInstance,
  error: AuthError
) => {
  api['error']({
    message: error.name,
    description: error.message,
  })
}

const SignUpForm: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [api, contextHolder] = notification.useNotification()
  const { supabase } = useSupabase()

  const [role, setRole] = useState<ERoles | undefined>()
  const [loadingRole, setLoadingRole] = useState(true)

  const currentRole = !token
    ? ERoles.PARTICIPANT
    : loadingRole
    ? ERoles.PARTICIPANT
    : role

  useEffect(() => {
    token &&
      fetch(
        `${process.env.NEXT_PUBLIC_URL!}/api/auth/verifyRole?token=${token}`
      ).then((response) =>
        response
          .json()
          .then((data) => {
            setRole(data.role)
            setLoadingRole(false)
          })
          .catch(() => {
            setRole(ERoles.PARTICIPANT)
            setLoadingRole(false)
          })
      )
  }, [token])

  const onFinish = async (values: FormType) => {
    if (!disabledSubmit && token && role) {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            fio: values.anthroponym,
            available_role: role,
          },
        },
      })

      if (error) {
        openNotificationWithIcon(api, error)
      } else {
        router.push('/')
      }
    }

    console.log('role:', currentRole)
    if (!token && currentRole === ERoles.PARTICIPANT) {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            fio: values.anthroponym,
            available_role: ERoles.PARTICIPANT,
          },
        },
      })

      if (error) {
        openNotificationWithIcon(api, error)
      } else {
        router.push('/')
      }
    }
  }

  const disabledSubmit = !!token ? loadingRole : false

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} style={{ marginBottom: '30px' }}>
        Регистрация!
      </Typography.Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* ФИО */}
        <Form.Item
          name="anthroponym"
          rules={[{ required: true, message: 'Введите ФИО' }]}
        >
          <Input placeholder="ФИО" autoComplete="off" />
        </Form.Item>

        {/* Роль */}
        <Input
          autoComplete="off"
          disabled
          value={!disabledSubmit ? currentRole : undefined}
          placeholder={disabledSubmit ? 'Загрузка...' : undefined}
          style={{ marginBottom: '24px' }}
        />

        {/* Почта */}
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'Введен неверный E-mail!',
            },
            {
              required: true,
              message: 'Пожалуйста, введите свой E-mail!',
            },
          ]}
        >
          <Input placeholder="E-mail" autoComplete="off" type="email" />
        </Form.Item>

        {/* Пароль */}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ваш пароль!',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Пароль" autoComplete="off" />
        </Form.Item>

        {/* Подтверждение пароля */}
        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Пожалуйста, повторите свой пароль!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error('Два введенных вами пароля не совпадают!')
                )
              },
            }),
          ]}
        >
          <Input.Password placeholder="Повторите пароль" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={disabledSubmit}
          >
            Зарегистрироваться
          </Button>
          Или <Link href="/sign_in">войти в существующий аккаунт!</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default SignUpForm
