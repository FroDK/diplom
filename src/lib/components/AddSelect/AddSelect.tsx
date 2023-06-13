import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Select, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface IAddSelectProps {
  onChange: (e: any) => void
  values: string[] | undefined
}

const AddSelect = ({ onChange, values }: IAddSelectProps) => {
  const [items, setItems] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [name, setName] = useState('')
  const inputRef = useRef(null)
  const onNameChange = (event: any) => {
    setName(event.target.value)
  }

  const addItem = (e: any) => {
    e.preventDefault()
    items && setItems([...items, name])
    setName('')
  }

  useEffect(() => {
    values && setSelectedItems(values)
  }, [values])

  return (
    <Select
      style={{ width: 418 }}
      onChange={onChange}
      value={selectedItems}
      mode="tags"
      placeholder="Расскажите о себе, хобби, интересы и тд."
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <Space
            style={{
              padding: '0 8px 4px',
            }}
          >
            <Input
              placeholder="Введите свойство"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button
              disabled={!name}
              type="text"
              icon={<PlusOutlined />}
              onClick={addItem}
            >
              Добавить свойство
            </Button>
          </Space>
        </>
      )}
      options={items?.map((item: string) => ({
        label: item,
        value: item,
      }))}
    />
  )
}

export default AddSelect
