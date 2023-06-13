'use client'

import styles from './styles.module.scss'
import PageWrapper from '@/lib/components/PageWrapper'
import { Typography } from 'antd'

interface ITypeContest {
  id: string
  name: string
}

interface IChampionChipsHistoryProps {
  address: string
  city: string
  country: string
  created_at: string
  description: string
  id: string
  kind_of_contest: string
  status: string
  title: string
  type_contest: ITypeContest
}

interface IData {
  data: IChampionChipsHistoryProps
}

export default function ChampionshipHistory(data: any) {
  console.log(data)
  return (
    <PageWrapper title="История чемпионатов">
      <table className={styles.table}>
        <tbody>
          <tr className={styles.row}>
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
          </tr>
          {data?.data.map((item: any, i: number) => {
            const statusColor =
              item.status === 'in_progress'
                ? '#4DCB4A'
                : item.status === 'completed'
                ? '#CB4A69'
                : 'rgba(0, 0, 0, 0.88)'
            const status =
              item.status === 'in_progress'
                ? 'В процессе'
                : item.status === 'completed'
                ? 'Завершена'
                : 'Не начата'
            return (
              <tr id={`${item.id}`} className={styles.row} key={i}>
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {item.title}
                  </Typography>
                </td>
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {(item.created_at && new Date(item.created_at).toLocaleDateString()) ||
                      'Нет данных'}
                  </Typography>
                </td>
                <td>
                  <Typography
                    style={{
                      fontSize: '14px',
                      color: statusColor,
                    }}
                  >
                    {status}
                  </Typography>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {data?.data.length === 0 && (
        <Typography  style={{marginTop: '20px'}}>
          {'Нет чемпионатов, в которых вы принимали или принимаете участие:('}
        </Typography>
      )}
    </PageWrapper>
  )
}
