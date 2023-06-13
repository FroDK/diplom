'use client'

import { ColumnsType } from 'antd/es/table'
import { Button, Form, Input, Space, Table } from 'antd'
import { useCallback, useState } from 'react'
import { ERoles, ERolesLocalize } from '@/widgets/Dashboard/models/navItems'
import _ from 'lodash'
import fp from 'lodash/fp'
import Fuse from 'fuse.js'

export type UserType = {
  id: string
  fio: string
  user_role: string | undefined
  email: string
  phone: string
  description: string | undefined
  qualities: string[]
}

interface UserTableProps {
  users: UserType[]
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

export const UserTable = ({ users }: UserTableProps) => {
  const [usersData, setUsersData] = useState(users)
  const [expertLink, setExpertLink] = useState(
    `${process.env.NEXT_PUBLIC_URL!}/************************`
  )
  const [loadingExpertLink, setLoadingExpertLink] = useState(false)
  const [disabledExpertLink, setDisabledExpertLink] = useState(true)

  const [chairmanLink, setChairmanLink] = useState(
    `${process.env.NEXT_PUBLIC_URL!}/************************`
  )
  const [loadingChairmanLink, setLoadingChairmanLink] = useState(false)
  const [disabledChairmanLink, setDisabledChairmanLink] = useState(true)

  const columns: ColumnsType<UserType> = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
    },
    {
      title: 'Текущая роль',
      dataIndex: 'user_role',
      key: 'user_role',
      // @ts-ignore
      render: (_, record) => ERolesLocalize[record.user_role],
    },
    {
      title: 'E-mail',
      key: 'email',
      dataIndex: 'email',
    },
  ]

  const handleGenerateLink = async (role: string) => {
    switch (role) {
      case ERoles.EXPERT: {
        setLoadingExpertLink(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/generateToken?role=${role}`
        )
        const { token } = await response.json()

        setExpertLink(`${process.env.NEXT_PUBLIC_URL}/sign_up?token=${token}`)
        setDisabledExpertLink(false)
        setLoadingExpertLink(false)

        break
      }

      case ERoles.CHAIRMAN: {
        setLoadingChairmanLink(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/generateToken?role=${role}`
        )
        const { token } = await response.json()

        setChairmanLink(`${process.env.NEXT_PUBLIC_URL}/sign_up?token=${token}`)
        setDisabledChairmanLink(false)
        setLoadingChairmanLink(false)

        break
      }
    }
  }

  const onInputChange = useCallback(
    (e: any) => {
      const searchValue = e.target.value

      const fuseOptions = {
        keys: ['fio'],
        threshold: 0.4, // Пороговое значение схожести (от 0 до 1)
      }
      const fuse = new Fuse(users, fuseOptions)

      // Выполняем нечеткий поиск
      const result = fuse.search(searchValue)

      const flatUsers = _.flatMap(result, 'item')

      setUsersData(searchValue.length ? flatUsers : users)
    },
    [users]
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Form {...layout} layout="horizontal" style={{ maxWidth: '800px' }}>
        <Form.Item name="role_expert" label="Ссылка для роли эксперта:">
          <Space direction="horizontal">
            <Input
              value={expertLink}
              disabled={disabledExpertLink}
              style={{ width: '600px' }}
            ></Input>
            <Button
              onClick={() => handleGenerateLink(ERoles.EXPERT)}
              loading={loadingExpertLink}
            >
              Сгенерировать ссылку
            </Button>
          </Space>
        </Form.Item>
        <Form.Item name="role_chairman" label="Ссылка для роли председателя:">
          <Space direction="horizontal">
            <Input
              value={chairmanLink}
              disabled={disabledChairmanLink}
              style={{ width: '600px' }}
            ></Input>
            <Button
              onClick={() => handleGenerateLink(ERoles.CHAIRMAN)}
              loading={loadingChairmanLink}
            >
              Сгенерировать ссылку
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={usersData}
        title={() => (
          <Input placeholder="Поиск пользователя" onChange={onInputChange} />
        )}
      />
    </Space>
  )
}
