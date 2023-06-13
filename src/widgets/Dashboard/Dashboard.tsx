'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Button, Layout, Menu, MenuProps } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import './index.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogoutOutlined } from '@ant-design/icons'
import { useSupabase } from '@/init/providers/supabase-provider'
const { Header, Content, Sider } = Layout
import { usePathname } from 'next/navigation'

export const Dashboard = ({
  children,
  items,
}: {
  children: React.ReactNode
  items: ItemType[] | undefined
}) => {
  const pathname = usePathname()
  const currentPath = `/${pathname.split('/').at(-1)}`

  const [selectedKey, setSelectedKey] = useState(currentPath)
  const router = useRouter()
  const { supabase } = useSupabase()

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
    router.push('/dashboard' + e.key)
  }

  const onButtonClick = useCallback(() => {
    supabase.auth.signOut()
  }, [supabase])

  const headerTitle = useMemo(() => {
    if (items?.length) {
      // @ts-ignore
      return items.find((item: ItemType) => item.key === selectedKey).label
    } else {
      return ''
    }
  }, [items, selectedKey])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        {/* LOGO */}
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgb(255,255,255)',
          }}
        >
          <Image src="/logo.png" alt="logo" width={164} height={31} />
        </div>
        <Menu
          onClick={onClick}
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
        />
        <div className="sign-out">
          <Button icon={<LogoutOutlined />} block onClick={onButtonClick}>
            Выйти
          </Button>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid #DDDDDD',
          }}
        >
          {headerTitle}
        </Header>
        <Content style={{ padding: '30px' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}
