'use client'

import { Typography } from 'antd'
import styles from './styles.module.scss'

import cn from 'classnames'
import { useMemo } from 'react'

interface ITeamMember {
  id: string
  is_captain: boolean
  users: {
    fio: string
    email: string
    phone?: string | null
  }
}
interface IProps {
  contestDate: string
  contestName: string
  contestStatus: string

  teamName: string
  teamMembers: ITeamMember[]
}

const TeamItem = ({
  contestStatus,
  contestName,
  contestDate,
  teamName,
  teamMembers,
}: IProps) => {
  const inProgress = contestStatus !== 'completed'

  const statusColor =
    contestStatus === 'in_progress'
      ? '#4DCB4A'
      : contestStatus === 'completed'
      ? '#CB4A69'
      : 'rgba(0, 0, 0, 0.88)'

  const statusText =
    contestStatus === 'in_progress'
      ? 'В процессе'
      : contestStatus === 'completed'
      ? 'Завершена'
      : 'Не начата'

  const date = useMemo(() => {
    if (contestDate) {
      return new Date(contestDate).toLocaleDateString()
    }
  }, [contestDate])

  return (
    <div className={cn(styles.wrapper, !inProgress && styles.disable)}>
      <div className={styles.status}>
        {date !== undefined && (
          <Typography
            style={{
              fontWeight: '300',
              fontSize: '10px',
            }}
            color={'#6E6E6E'}
          >
            {date}
          </Typography>
        )}
        <Typography
          style={{
            fontWeight: '300',
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >
          {contestName}
        </Typography>
        <Typography
          style={{
            fontWeight: '300',
            fontSize: '10px',
            color: statusColor,
          }}
        >
          {statusText}
        </Typography>
      </div>
      <Typography
        className={styles.title}
        style={{
          fontWeight: '700',
          fontSize: '16px',
        }}
      >
        {teamName}
      </Typography>
      <div className={styles.content}>
        {teamMembers.map((item, i) => {
          return (
            <div key={i} className={styles.item}>
              <Typography
                className={cn(
                  styles.fullName,
                  item.is_captain && styles.capitan
                )}
                style={{
                  fontWeight: '400',
                  fontSize: '14px',
                }}
              >
                {`${i + 1}. ${item.users.fio}`}
              </Typography>
              {item.users.email && (
                <Typography
                  style={{
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                  className={styles.email}
                >
                  {item.users.email}
                </Typography>
              )}
              {item.users.phone && (
                <Typography
                  style={{
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                >
                  {item.users.phone}
                </Typography>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeamItem
