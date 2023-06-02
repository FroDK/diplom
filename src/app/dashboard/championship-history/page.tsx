'use client'

import { useState } from 'react'

import styles from './styles.module.scss'
import { Modal } from '@/lib/components/Modal'
import IconOk from '@/ui/icons/IconOk'
import PageWrapper from '@/lib/components/PageWrapper'
import { Typography } from 'antd'

const history = [
  {
    id: 1,
    name: 'Битва маркетологов',
    date: '23.02.2023',
    status: 'В процессе',
    winner: '------',
    members: [
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: true,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
    ],
  },
  {
    id: 2,
    name: 'Битва',
    date: '23.02.2023',
    status: 'Завершено',
    winner: 'Заводные котята',
    members: [
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: true,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
    ],
  },
  {
    id: 3,
    name: 'маркетологов',
    date: '23.02.2023',
    status: 'Завершено',
    winner: 'Веселые гномы',
    members: [
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: true,
        email: 'elvira_volkova_1988@yandex.ru',
      },
      {
        fullName: 'Иванов Иван Иванович',
        isCaptain: false,
        email: 'elvira_volkova_1988@yandex.ru',
      },
    ],
  },
]

export default async function ChampionshipHistory() {
  const [showModal, setShowModal] = useState(false)
  const [id, setId] = useState<number | undefined>(undefined)

  const handleClick = (id?: number) => {
    const index = history.findIndex((item) => item.id === id)
    setId(index)
    setShowModal(!showModal)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
  return (
    <PageWrapper title="История чемпионатов">
      <table className={styles.table}>
        <tbody>
          <tr onClick={() => handleClick} className={styles.row}>
            <td>
              <Typography
                color={'#454B53'}
                style={{
                  fontSize: '14px',
                }}
              >
                НАЗВАНИЕ
              </Typography>
            </td>
            <td>
              <Typography
                color={'#454B53'}
                style={{
                  fontSize: '14px',
                }}
              >
                ДАТА ПРОВЕДЕНИЯ
              </Typography>
            </td>
            <td>
              <Typography
                color={'#454B53'}
                style={{
                  fontSize: '14px',
                }}
              >
                СТАТУС
              </Typography>
            </td>
            <td>
              <Typography
                color={'#454B53'}
                style={{
                  fontSize: '14px',
                }}
              >
                ПОБЕДИТЕЛЬ
              </Typography>
            </td>
          </tr>
          {history.map((item, i) => {
            const statusColor =
              item.status === 'В процессе' ? '#4DCB4A' : '#CB4A69'
            return (
              <tr
                id={`${item.id}`}
                onClick={() => handleClick(item.id)}
                className={styles.row}
                key={i}
              >
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {item.name}
                  </Typography>
                </td>
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {item.date}
                  </Typography>
                </td>
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                      color: statusColor,
                    }}
                  >
                    {item.status}
                  </Typography>
                </td>
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {item.winner}
                  </Typography>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {showModal && (
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          title={`Команда: ${history[id as number]?.name}`}
          titleSize={16}
          content={
            <table className={styles.modal}>
              <tbody>
                <tr>
                  <td>
                    <Typography color={'#656ED3'}>ФИО участников:</Typography>
                  </td>
                  <td>
                    <Typography color={'#656ED3'}>Капитан:</Typography>
                  </td>
                  <td>
                    <Typography color={'#656ED3'}>E-mail:</Typography>
                  </td>
                </tr>
                {history[id as number]?.members.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className={styles.fullName}>{`${i + 1}. ${
                        item.fullName
                      }`}</td>
                      <td>{item.isCaptain && <IconOk />}</td>
                      <td>{item.email}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }
        />
      )}
    </PageWrapper>
  )
}
