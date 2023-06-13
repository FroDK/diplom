'use client'

import { Table, TableColumnsType } from 'antd'
import { ColumnsType } from 'antd/es/table'
import _ from 'lodash'
import { ERolesLocalize } from '@/widgets/Dashboard/models/navItems'

interface TeamsTableProps {
  data: any[]
}

export const TeamsCompositionTable = ({ data }: TeamsTableProps) => {
  console.log('data:', data)

  // Группируем данные по идентификаторам команд
  const groupedData = _.groupBy(data, 'team.id')

  // Преобразуем группированные данные в нужный формат
  const result = Object.entries(groupedData).map(([teamId, users]) => ({
    team: {
      id: teamId,
      contest: users[0].team.contest,
      name: users[0].team.name,
    },
    users: users.map((user) => ({
      is_captain: user.is_captain,
      id: user.user.id,
      fio: user.user.fio,
      email: user.user.email,
      phone: user.user.phone,
      user_role: user.user.user_role,
      description: user.user.description,
      qualities: user.user.qualities,
    })),
  }))

  console.log('result:', result)

  const columns: ColumnsType<any> = [
    {
      title: 'Наименование',
      dataIndex: ['team', 'name'],
      key: 'name',
    },
  ]

  const expandedRowRender = (record: any) => {
    const columns: TableColumnsType<any> = [
      { title: 'ФИО', dataIndex: 'fio', key: 'fio' },
      { title: 'E-mail', dataIndex: 'email', key: 'email' },
      {
        title: 'Роль',
        dataIndex: 'user_role',
        key: 'user_role',
        // @ts-ignore
        render: (_, record) => ERolesLocalize[record.user_role],
      },
      {
        title: 'Капитан',
        dataIndex: 'is_captain',
        key: 'is_captain',
        // @ts-ignore
        render: (_, record) => (record.is_captain ? 'Да' : 'Нет'),
      },
    ]

    console.log('record:', record)

    return (
      <Table
        columns={columns}
        dataSource={record.users}
        pagination={false}
        rowKey={record}
      />
    )
  }

  return (
    <div>
      <Table
        bordered
        dataSource={result}
        columns={columns}
        expandable={{ expandedRowRender }}
        rowKey={(r) => {
          return r.team.id
        }}
      />
    </div>
  )
}
