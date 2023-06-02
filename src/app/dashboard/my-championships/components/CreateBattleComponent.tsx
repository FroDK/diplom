import cn from 'classnames'

import styles from './styles.module.scss'
import { Button, Typography } from 'antd'
import IconBasket from '@/ui/icons/IconBasket'
import { ICreateBattleComponentProps } from './types'

const mok = [
  'Модуль А',
  'Модуль B',
  'Модуль C',
  'Модуль D',
  'Модуль E',
  'Модуль F',
]

const CreateBattleComponent = ({ title, id, status }: ICreateBattleComponentProps) => {
  const colorStatus = (status === 'В процессе' ? '#4DCB4A' : '#CB4A69')
  const handleDelete = () => {
    console.log('delete')
  }

  const handleEdit = () => {
    console.log('edit')
  }
  return (
    <div
      className={cn(styles.wrapper, status === 'Завершено' && styles.finished)}
    >
      <div className={styles.header}>
        <div className={styles.about}>
          <Typography
            style={{
              fontSize: '16px',
              fontWeight: '600',
            }}
            className={styles.title}
          >
            {title}
          </Typography>
          <Typography
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: colorStatus
            }}
            className="status"
          >
            {status}
          </Typography>
        </div>
        <Button disabled={status === 'Завершено'}>+ Добавить форму</Button>
      </div>

      <div className={styles.modules}>
        {mok.map((item, i) => {
          return (
            <div key={i} className={styles.item}>
              <Typography
                style={{
                  fontSize: '14px',
                }}
              >
                {' '}
                {`${item}:`}
              </Typography>
              <div className={styles.buttons}>
                <Button className={styles.button} onClick={handleEdit} disabled={status === 'Завершено'}>
                  Редактировать
                </Button>
                <IconBasket onClick={handleDelete} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CreateBattleComponent
