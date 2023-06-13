'use client'

import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

interface TeamsTableProps {
  data: any[]
}

export const TeamsTable = ({ data }: TeamsTableProps) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
    },
  ]

  return (
    <div>
      <Table bordered dataSource={data} columns={columns} />
    </div>
  )
}
