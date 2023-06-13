'use client'

import {
  Button,
  Card,
  Cascader,
  Form,
  Input,
  notification,
  Select,
  Space,
} from 'antd'
import React, { useMemo } from 'react'
import { useSupabase } from '@/init/providers/supabase-provider'
import _ from 'lodash'
import { ERolesLocalize } from '@/widgets/Dashboard/models/navItems'
import { ContestStatusLocalize, EContestStatus } from '@/shared/enums'
import { IFormCriteria } from '@/app/dashboard/my-championships/components/types'
import { uuid } from '@supabase/gotrue-js/dist/module/lib/helpers'

type FormType = {
  address: string
  city: string
  country: string
  description: string | undefined
  status: string
  title: string
  typeOfContest: string
  kindOfContest: string
  usersFromForm: Array<string[]>
  form?: IFormCriteria[]
}

interface ICreateChampionshipFormProps {
  users: any
  typesContest: any
  onSuccess?: () => void
}

export const CreateChampionshipForm = ({
  users,
  typesContest,
  onSuccess,
}: ICreateChampionshipFormProps) => {
  const [api, contextHolder] = notification.useNotification()
  const { supabase } = useSupabase()

  const groupedUsers = useMemo(() => _.groupBy(users, 'user_role'), [users])

  const cascadeUsers = useMemo(
    () =>
      Object.entries(groupedUsers).map(([key, value]) => {
        return {
          // @ts-ignore
          label: ERolesLocalize[key] ?? 'Нет роли',
          value: key,
          // @ts-ignore
          children: value.map((user) => ({
            value: user.id,
            label: user.fio ?? 'Безымянный',
          })),
        }
      }),
    [groupedUsers]
  )
  const onFinish = async ({
    title,
    description,
    country,
    city,
    address,
    status,
    kindOfContest,
    typeOfContest,
    usersFromForm,
  }: FormType) => {
    const { data: createdContest, error: errorCreateContest } = await supabase
      .from('contest')
      .insert({
        title,
        description,
        country,
        city,
        address,
        status,
        kind_of_contest: kindOfContest,
        type_contest: typeOfContest,
      })
      .select('id')

      const championShipsInit = JSON.parse(localStorage.getItem('championShips') as string) ? JSON.parse(localStorage.getItem('championShips') as string) : []

      const championShips = [...championShipsInit, {
        id: uuid(),
        title,
        description,
        country,
        city,
        address,
        status,
        kind_of_contest: kindOfContest,
        type_contest: typeOfContest,
        form: [],
      } ]

      localStorage.setItem('championShips', JSON.stringify(championShips))

    if (errorCreateContest) {
      api['error']({
        message: 'Ошибка',
        description: errorCreateContest.message,
      })
      return
    } else {
      api['success']({
        message: 'Успешно',
        description: 'Чемпионат был создан',
      })
    }

    // Функция для фильтрации пользователей по роли
    function filterUsersByRole(users: any, role: any) {
      return users.filter((user: any) => user.user_role === role)
    }

    // Функция для получения массива идентификаторов пользователей
    function getUserIds(users: any) {
      return users.map((user: any) => user.id)
    }

    // Функция для преобразования выбранных ролей и идентификаторов в массив идентификаторов пользователей
    function transformSelectedRolesAndIds(
      users: any,
      selectedRolesAndIds: any
    ) {
      const userIds: any = []

      selectedRolesAndIds.forEach((selectedRoleAndId: any) => {
        if (selectedRoleAndId.length === 2) {
          const [role, id] = selectedRoleAndId
          const user = users.find(
            (user: any) => user.id === id && user.user_role === role
          )
          if (user) {
            userIds.push(user.id)
          }
        } else if (selectedRoleAndId.length === 1) {
          const [role] = selectedRoleAndId
          const filteredUsers = filterUsersByRole(users, role)
          const filteredUserIds = getUserIds(filteredUsers)
          userIds.push(...filteredUserIds)
        }
      })

      return userIds
    }

    const userIds = transformSelectedRolesAndIds(users, usersFromForm)

    const { data, error: errorCreateUserContest } = await supabase
      .from('contest_user')
      .insert(
        userIds.map((userId: any) => ({
          contest_id: createdContest[0].id,
          user_id: userId,
        }))
      )

    if (errorCreateUserContest) {
      api['error']({
        message: 'Ошибка',
        description: errorCreateUserContest.message,
      })
    } else {
      api['success']({
        message: 'Успешно',
        description: 'Пользователи были добавлены в чемпионат',
      })

      onSuccess?.()
    }
  }

  return (
    <>
      {contextHolder}
      <Form
        name="create_contest"
        className="create_contest"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Название:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input placeholder="Название" />
        </Form.Item>

        <Form.Item name="description" label="Описание:">
          <Input placeholder="Описание" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Страна:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input placeholder="Страна" />
        </Form.Item>

        <Form.Item
          name="city"
          label="Город:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input placeholder="Город" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Адрес:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input placeholder="Адрес" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Статус:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Select placeholder="Статус">
            <Select.Option value={EContestStatus.NOT_START}>
              {ContestStatusLocalize[EContestStatus.NOT_START]}
            </Select.Option>
            <Select.Option value={EContestStatus.IN_PROGRESS}>
              {ContestStatusLocalize[EContestStatus.IN_PROGRESS]}
            </Select.Option>
            <Select.Option value={EContestStatus.COMPLETED}>
              {ContestStatusLocalize[EContestStatus.COMPLETED]}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="kindOfContest"
          label="Вид чемпионата:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input placeholder="Вид чемпионата" />
        </Form.Item>

        <Form.Item
          name="typeOfContest"
          label="Тип чемпионата:"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Select placeholder="Тип чемпионата">
            {typesContest?.map((type: any) => (
              <Select.Option value={type.id} key={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="usersFromForm"
          label="Пользователи"
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Cascader
            style={{ width: '100%' }}
            options={cascadeUsers}
            multiple
            maxTagCount="responsive"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Создать
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
