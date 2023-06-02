'use client'

import { Button, Form, Input, message, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useCallback, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useSupabase } from '@/init/providers/supabase-provider'

export type TypeContestType = {
  id: number
  key: string
  name: string
}

interface TypeContestProps {
  data: TypeContestType[]
}

export const TypeContestTable = ({ data }: TypeContestProps) => {
  const [typesData, setTypesData] = useState(() => data)
  const { supabase } = useSupabase()
  const [messageApi, contextHolder] = message.useMessage()

  const [isOpen, setIsOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  const successMessage = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: 'Новый тип был успешно создан',
    })
  }, [messageApi])

  const errorMessage = useCallback(() => {
    messageApi.open({
      type: 'error',
      content: 'Ой, что-то пошло не так',
    })
  }, [messageApi])

  const onSubmit = useCallback(
    async ({ name }: { name: string }) => {
      setConfirmLoading(true)

      const { data: types, error } = await supabase
        .from('type_contest')
        .insert({ name })
        .select()

      console.log(types)

      if (error) {
        errorMessage()
      } else {
        successMessage()

        await fetch(
          `${process.env.NEXT_PUBLIC_URL!}/api/revalidate?` +
            new URLSearchParams({
              path: '/dashboard/championship-types',
            }),
          {
            method: 'GET',
          }
        )

        setTypesData([
          ...typesData,
          {
            id: typesData.at(-1)!.id + 1,
            key: types[0].id,
            name: types[0].name,
          },
        ])
      }

      setConfirmLoading(false)
      setIsOpen(false)
    },
    [errorMessage, successMessage, supabase, typesData]
  )

  const openModal = () => {
    setIsOpen(true)
  }

  const closePopup = useCallback(() => {
    form.resetFields()
    setIsOpen(false)
  }, [form])

  const columns: ColumnsType<TypeContestType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
    },
  ]

  return (
    <div>
      {contextHolder}

      <Button type="primary" onClick={openModal} icon={<PlusOutlined />}>
        Создать тип чемпионата
      </Button>
      <Modal
        title="Создание типа чемпионата"
        open={isOpen}
        onOk={form.submit}
        onCancel={closePopup}
        confirmLoading={confirmLoading}
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item
            name="name"
            label="Название"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите название для типа конкурса',
              },
            ]}
          >
            <Input placeholder="Пожалуйста, введите название" />
          </Form.Item>
        </Form>
      </Modal>

      <Table bordered dataSource={typesData} columns={columns} />
    </div>
  )
}
