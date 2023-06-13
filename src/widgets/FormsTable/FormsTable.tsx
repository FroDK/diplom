'use client'

import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import _ from 'lodash'

interface TeamsTableProps {
  data: any[]
}

export const FormsTable = ({ data }: TeamsTableProps) => {
  const result = _.flatMap(data, 'form')

  const columns: ColumnsType<any> = [
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  return (
    <div>
      <Table bordered dataSource={result} columns={columns} />
    </div>
  )
}
