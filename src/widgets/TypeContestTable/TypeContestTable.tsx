'use client'

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
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
  const [editedRecord, setEditedRecord] = useState<TypeContestType | null>(null)

  const successMessage = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: !!editedRecord
        ? 'Тип был успешно изменен'
        : 'Новый тип был успешно создан',
    })
  }, [editedRecord, messageApi])

  const errorMessage = useCallback(() => {
    messageApi.open({
      type: 'error',
      content: 'Ой, что-то пошло не так',
    })
  }, [messageApi])

  const onSubmit = useCallback(
    async ({ name }: { name: string }) => {
      setConfirmLoading(true)

      const updateOrInsertRecord = !!editedRecord
        ? {
            id: editedRecord.key,
            name,
          }
        : {
            name,
          }

      const { error } = await supabase
        .from('type_contest')
        .upsert(updateOrInsertRecord)
        .select()

      const { data: types } = await supabase.from('type_contest').select()

      console.log('types:', types)

      if (error) {
        errorMessage()
      } else {
        successMessage()

        const dataType = types?.map((type, index) => ({
          id: ++index,
          key: type.id,
          name: type.name,
        }))

        setTypesData(dataType!)
      }

      setConfirmLoading(false)
      setIsOpen(false)
    },
    [editedRecord, errorMessage, successMessage, supabase]
  )

  const openModal = () => {
    setEditedRecord(null)
    setIsOpen(true)
  }

  const closePopup = useCallback(() => {
    form.resetFields()
    setIsOpen(false)
  }, [form])

  const handleUpdateAction = async (record: TypeContestType) => {
    console.log('edit record:', record)
    setIsOpen(true)
    setEditedRecord(record)
  }

  const handleDeleteAction = async (record: TypeContestType) => {
    console.log('delete record:', record)
    await supabase.from('type_contest').delete().eq('id', record.key)

    const { data: types } = await supabase.from('type_contest').select()

    const dataType = types?.map((type, index) => ({
      id: ++index,
      key: type.id,
      name: type.name,
    }))

    messageApi.open({
      type: 'success',
      content: 'Тип был успешно удален',
    })

    setTypesData(dataType!)
  }

  useEffect(() => {
    form.setFieldsValue({
      name: editedRecord ? editedRecord.name : undefined,
    })
  }, [editedRecord, form])

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
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Удалить тип">
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAction(record)}
            />
          </Tooltip>
          <Tooltip title="Изменить тип">
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

  return (
    <div>
      {contextHolder}

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

      <Table
        bordered
        dataSource={typesData}
        columns={columns}
        footer={() => (
          <Button type="primary" onClick={openModal} icon={<PlusOutlined />}>
            Создать тип чемпионата
          </Button>
        )}
      />
    </div>
  )
}
