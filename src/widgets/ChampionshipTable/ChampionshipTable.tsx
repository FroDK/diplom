'use client'

import { ColumnsType } from 'antd/es/table'
import {
  Badge,
  Button,
  Drawer,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ERolesLocalize } from '@/widgets/Dashboard/models/navItems'
import { ContestStatusLocalize, EContestStatus } from '@/shared/enums'
import { useState } from 'react'
import { CreateChampionshipForm } from '@/widgets/CreateChampionshipForm/CreateChampionshipForm'
import { useSupabase } from '@/init/providers/supabase-provider'
import { UpdateChampionshipForm } from '@/widgets/UpdateChampionshipForm/UpdateChampionshipForm'

interface ExpandedContestDataType {
  id: string
  fio: string
  email: string
  user_role: string
}

export interface ContestDataType {
  id: string
  title: string
  address: string
  city: string
  country: string
  description: string
  kind_of_contest: string
  status: EContestStatus
  created_at: string
  users: ExpandedContestDataType[]
  type_contest: { id: string; name: string }
}

interface ChampionshipTableProps {
  contest: ContestDataType[]
}

export const ChampionshipTable = ({ contest }: ChampionshipTableProps) => {
  const { supabase } = useSupabase()

  const [open, setOpen] = useState(false)
  const [openUpdateForm, setOpenUpdateForm] = useState(false)
  const [users, setUsers] = useState<any>([])
  const [typesContest, setTypesContest] = useState<any>([])
  const [championships, setChampionships] = useState(contest)
  const [loadingCreateChampionship, setLoadingCreateChampionship] =
    useState(false)
  const [contestForUpdate, setContestForUpdate] =
    useState<ContestDataType | null>(null)

  const handleUpdateAction = async (record: ContestDataType) => {
    await loadData()

    console.log(record)
    setContestForUpdate(record)
    setOpenUpdateForm(true)
  }

  const columns: ColumnsType<ContestDataType> = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Страна',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Город',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Вид чемпионата',
      dataIndex: 'kind_of_contest',
      key: 'kind_of_contest',
    },
    {
      title: 'Тип чемпионата',
      dataIndex: 'type_contest',
      key: 'type_contest',
      render: (_, record) => record.type_contest.name,
    },
    {
      title: 'Дата создания',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_, record) => new Date(record.created_at).toLocaleDateString(),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',

      render: (_, record) => (
        <Badge
          status={
            record.status === EContestStatus.IN_PROGRESS
              ? 'processing'
              : record.status === EContestStatus.COMPLETED
              ? 'success'
              : 'default'
          }
          text={ContestStatusLocalize[record.status]}
        />
      ),
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Удалить чемпионат">
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {}}
            />
          </Tooltip>
          <Tooltip title="Изменить чемпионат">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleUpdateAction(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const expandedRowRender = (record: ContestDataType) => {
    const columns: TableColumnsType<ExpandedContestDataType> = [
      { title: 'ФИО', dataIndex: 'fio', key: 'fio' },
      { title: 'E-mail', dataIndex: 'email', key: 'email' },
      {
        title: 'Роль',
        dataIndex: 'user_role',
        key: 'user_role',
        // @ts-ignore
        render: (_, record) => ERolesLocalize[record.user_role],
      },
    ]

    return (
      <Table
        columns={columns}
        dataSource={record.users}
        pagination={false}
        rowKey="id"
      />
    )
  }

  const onClose = () => {
    setOpen(false)
  }

  const onCloseUpdateForm = () => {
    setOpenUpdateForm(false)
    setContestForUpdate(null)
  }

  const onSuccessCreateChampionship = async () => {
    const { data, error } = await supabase.from('contest').select(`
      id,
      title,
      address,
      city,
      country,
      description,
      kind_of_contest,
      status,
      created_at,
      users (
        id,
        fio,
        email,
        user_role
      ),
      type_contest (
        id,
        name
      )
    `)

    setChampionships(data as unknown as ContestDataType[])
    setOpen(false)
  }

  const loadData = async () => {
    const { data: typesContestData } = await supabase
      .from('type_contest')
      .select()
    const { data: usersData } = await supabase.from('users').select()

    setUsers(usersData)
    setTypesContest(typesContestData)
  }
  const handleCreateChampionship = async () => {
    setLoadingCreateChampionship(true)

    await loadData()

    setLoadingCreateChampionship(false)
    setOpen(true)
  }

  return (
    <>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={championships}
        expandable={{ expandedRowRender }}
        size="small"
        footer={() => (
          <Button
            type="primary"
            onClick={handleCreateChampionship}
            loading={loadingCreateChampionship}
          >
            Создать чемпионат
          </Button>
        )}
      />
      <Drawer
        title="Создать новый чемпионат"
        placement="right"
        onClose={onClose}
        open={open}
        width={480}
      >
        <CreateChampionshipForm
          typesContest={typesContest}
          users={users}
          onSuccess={onSuccessCreateChampionship}
        />
      </Drawer>

      <Drawer
        title="Обновить чемпионат"
        placement="right"
        onClose={onCloseUpdateForm}
        open={openUpdateForm}
        width={480}
      >
        {openUpdateForm && (
          <UpdateChampionshipForm
            contest={contestForUpdate}
            typesContest={typesContest}
            users={users}
            onSuccess={onSuccessCreateChampionship}
          />
        )}
      </Drawer>
    </>
  )
}
