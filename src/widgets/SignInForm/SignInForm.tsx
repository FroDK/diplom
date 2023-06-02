'use client'

import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, notification, Typography } from 'antd'
import './index.css'
import Link from 'next/link'
import { NotificationInstance } from 'antd/es/notification/interface'
import { AuthError } from '@supabase/gotrue-js'
import { useSupabase } from '@/init/providers/supabase-provider'
import { useRouter } from 'next/navigation'

type FormType = {
  email: string
  password: string
  remember: string
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

const SignInForm: React.FC = () => {
  const [api, contextHolder] = notification.useNotification()
  const { supabase } = useSupabase()
  const router = useRouter()

  const onFinish = async (values: FormType) => {
    console.log('Received values of form: ', values)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      openNotificationWithIcon(api, error)
    }

    if (data?.session) {
      await router.push('/')
    }

    console.log(data)
    console.log(error)
  }

  return (
    <>
      {contextHolder}
      <Typography.Title level={3} style={{ marginBottom: '30px' }}>
        Здравствуйте!
      </Typography.Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="E-mail:"
          rules={[
            { required: true, message: 'Пожалуйста, введите Ваш e-mail!' },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
          />
        </Form.Item>
        <Form.Item
          label="Пароль:"
          name="password"
          rules={[
            { required: true, message: 'Пожалуйста, введите Ваш пароль!' },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Пароль"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Восстановить пароль
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Войти
          </Button>
          Или <Link href="/sign_up">зарегистрироваться!</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default SignInForm
