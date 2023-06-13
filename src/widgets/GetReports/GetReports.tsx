'use client'

import { useState } from 'react'
import { Modal } from '@/lib/components/Modal'
import PageWrapper from '@/lib/components/PageWrapper/PageWrapper'
import { Button, Select, Typography } from 'antd'

import styles from './styles.module.scss'
import { IUsers } from '@/app/dashboard/criteria-form/page/CriteriaFormPage'

export default function Reports({data, id}: {data: IUsers[], id: string | undefined}) {
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const handleClick = () => {
    setShowModal(!showModal)
  }

  const handleChange = (name: string) => {
    setSelectedUser(name)
  }

  return (
    <PageWrapper title="Отчеты">
      <div className={styles.reports}>
        <Typography
          style={{
            fontSize: '16px',
          }}
        >
          Вы получите:
        </Typography>
        <Typography
          style={{
            fontSize: '16px',
          }}
        >
          1. ФИО, e-mail, телефон
        </Typography>
        <Typography
          style={{
            fontSize: '16px',
          }}
        >
          2. Список битв (название, дата проведения, тип, результаты), в которых
          принимал участие выбранный участник
        </Typography>
        <Button className={styles.button} onClick={handleClick}>
          Вывод информации по конкретному участнику
        </Button>
      </div>
      {showModal && (
        <Modal
          onClose={handleClick}
          open={showModal}
          title="Отчет по конкретному участнику"
          titleSize={16}
          content={
            <>
              <div className={styles.input}>
                <Typography
                  className={styles.label}
                  style={{
                    fontSize: '14px',
                  }}
                >
                  Поиск участника:
                </Typography>
                <Select
                  showSearch
                  options={data?.map((item) => ({
                    label: item.fio,
                    name: item.fio,
                    value: item.fio,
                  }))}
                  onChange={handleChange}
                  style={{
                    width: '348px',
                  }}
                />
              </div>
              <Button disabled={selectedUser === ''} style={{color: '#fff', background: '#625FDA', borderColor: '#758FEA'}} className={styles.modalButton}>Сформировать</Button>
            </>
          }
        />
      )}
    </PageWrapper>
  )
}
