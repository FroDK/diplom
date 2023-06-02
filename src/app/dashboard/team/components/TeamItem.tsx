import { Typography } from 'antd'
import styles from './styles.module.scss'

import cn from 'classnames'

const title = 'Заводные котята'

interface ITeamItemProps {
  inProcess?: boolean
}

const members = [
  {
    fullName: 'Макаров Антон Владимирович',
    email: 'elvira_volkova_1988@yandex.ru',
    number: '+7(910)123-23-23',
    capitan: true,
  },
  {
    fullName: 'Макаров Антон Владимирович',
    email: 'elvira_volkova_1988@yandex.ru',
    number: '+7(910)123-23-23',
    capitan: false,
  },
  {
    fullName: 'Макаров Антон Владимирович',
    email: 'elvira_volkova_1988@yandex.ru',
    number: '+7(910)123-23-23',
    capitan: false,
  },
  {
    fullName: 'Макаров Антон Владимирович',
    email: 'elvira_volkova_1988@yandex.ru',
    number: '+7(910)123-23-23',
    capitan: false,
  },
]

const TeamItem = ({ inProcess }: ITeamItemProps) => {
  return (
    <div className={cn(styles.wrapper, !inProcess && styles.disable)}>
      <div className={styles.status}>
        <Typography
          style={{
            fontWeight: '300',
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >
          20.01.2023
        </Typography>
        <Typography
          style={{
            fontWeight: '300',
            fontSize: '10px',
          }}
          color={'#6E6E6E'}
        >
          Битва парикмахеров
        </Typography>
        <Typography
          style={{
            fontWeight: '300',
            fontSize: '10px',
          }}
          color={inProcess ? '#4DCB4A' : '#CB4A69'}
        >
          В процессе
        </Typography>
      </div>
      <Typography
        className={styles.title}
        style={{
          fontWeight: '700',
          fontSize: '16px',
        }}
      >
        {title}
      </Typography>
      <div className={styles.content}>
        {members.map((item, i) => {
          return (
            <div key={i} className={styles.item}>
              <Typography
                className={cn(styles.fullName, item.capitan && styles.capitan)}
                style={{
                  fontWeight: '400',
                  fontSize: '14px',
                }}
              >
                {`${i + 1}. ${item.fullName}`}
              </Typography>
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '14px',
                }}
                className={styles.email}
              >
                {item.email}
              </Typography>
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '14px',
                }}
              >
                {item.number}
              </Typography>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeamItem
