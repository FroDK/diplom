'use client'

import styles from './styles.module.scss'
import { ChangeEvent, useState } from 'react'
import ShowTeam from '@/lib/components/ShowTeam'
import { Modal } from '@/lib/components/Modal'
import { Button, Input, Select, Typography } from 'antd'
import IconX from '@/ui/icons/IconX'
import CardWrapper from '@/lib/components/CardWrapper'

interface IMembers {
  fullName: string
  isCaptain: boolean
  email: string
}
interface ITeams {
  name: string
  id: number
}
export interface IMok {
  id: number
  name: string
  chairman: string
  date: string
  type: string
  teams: ITeams[]
  members: IMembers[]
}
interface ICreationTeams extends IMok {
  mok?: IMok[]
  user?: IMembers[]
}

export const CreationTeams = ({
  id,
  mok,
  name,
  teams,
  user,
  chairman,
  date,
  type,
}: ICreationTeams) => {
  const [showTeam, setShowTeam] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [elemId, setElemId] = useState<number | undefined>(undefined)
  const [renameId, setRenameId] = useState<number | undefined>(undefined)
  const [renameValue, setRenameValue] = useState<string>('')
  const [addMemberId, setAddMemberId] = useState<number | undefined>(undefined)

  const handleShowTeam = () => {
    const index = mok?.findIndex((item) => item.id === id)
    setElemId(index)
    setShowTeam(!showTeam)
  }

  const handleShowRename = (id?: number) => {
    const index = teams.findIndex((item) => item.id === id)
    renameId && setRenameValue(teams[renameId]?.name)
    setRenameId(index)
    setShowRename(!showRename)
  }

  const handleRenameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value)
  }

  const handleSubmitRename = () => {
    const newObj = renameId && { ...teams[renameId], name: renameValue }

    console.log(newObj)
  }

  const handleAddMember = (id?: number) => {
    const index = teams.findIndex((item) => item.id === id)
    setAddMemberId(index)
    setShowAddMember(!showAddMember)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <Typography
          color={'#6e6e6e'}
          style={{
            fontSize: '10px',
            fontWeight: '300',
          }}
        >
          {date}
        </Typography>
        <Typography
          color={'#6e6e6e'}
          style={{
            fontSize: '10px',
            fontWeight: '300',
          }}
        >
          {`Председатель жюри: ${chairman}`}
        </Typography>
        <Typography
          color={'#6e6e6e'}
          style={{
            fontSize: '10px',
            fontWeight: '300',
          }}
        >
          {`Вид: ${type}`}
        </Typography>
      </div>
      <div className={styles.title}>
        <Typography
          style={{
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          {name}
        </Typography>
        <Button className={styles.button}>+ Добавить команду</Button>
      </div>
      <div className={styles.list}>
        {teams.map((item, i) => {
          return (
            <div key={item.id} className={styles.item}>
              <Typography
                className={styles.name}
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >{`${i + 1}. ${item.name}`}</Typography>
              <div className={styles.buttons}>
                <Button className={styles.button} onClick={handleShowTeam} size="small">
                  Посмотреть
                </Button>
                <Button className={styles.button} onClick={() => handleShowRename(item.id)} size="small">
                  Редактировать
                </Button>
                <Button className={styles.button} onClick={() => handleAddMember(item.id)} size="small">
                  Добавить участника
                </Button>
                <Button className={styles.button} size="small">Удалить</Button>
              </div>
            </div>
          )
        })}
      </div>
      {showTeam && mok && (
        <ShowTeam
          showModal={showTeam}
          handleClick={handleShowTeam}
          data={mok}
          id={elemId}
        />
      )}
      {showRename && (
        <Modal
          open={showRename}
          onClose={handleShowRename}
          title={''}
          content={
            <div className={styles.modalWrapper}>
              <div className={styles.content}>
                <Typography
                  style={{
                    fontSize: '16px',
                    fontWeight: '300',
                  }}
                >
                  Введите название команды:
                </Typography>
                <Input
                  style={{
                    width: '264px',
                  }}
                  value={renameValue}
                  onChange={handleRenameChange}
                />
              </div>
              <Button onClick={handleSubmitRename} className={styles.button}>
                Сохранить
              </Button>
            </div>
          }
        />
      )}
      {showAddMember && (
        <Modal
          open={showAddMember}
          onClose={handleAddMember}
          title={teams[addMemberId as number]?.name}
          content={
            <div>
              <div className={styles.addMemberWrapper}>
                <div className={styles.input}>
                  <Typography
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                    }}
                  >
                    Поиск участника:
                  </Typography>
                  <Select
                    showSearch
                    style={{
                      width: '348px',
                    }}
                    options={user?.map((item, i) => {
                      return {
                        name: item.fullName,
                        value: item.fullName,
                        key: i,
                      }
                    })}
                  />
                </div>
                <div className={styles.addMemberContent}>
                  <table>
                    <tbody>
                      <tr>
                        <td className={styles.title}>
                          <Typography
                            style={{
                              fontSize: '14px',
                              fontWeight: '400',
                            }}
                          >
                            ФИО участников:
                          </Typography>
                        </td>
                        <td className={styles.checkbox}>
                          <Typography
                            style={{
                              fontSize: '14px',
                              fontWeight: '400',
                            }}
                          >
                            Капитан:
                          </Typography>
                        </td>
                        <td></td>
                      </tr>
                      {user?.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td className={styles.title}>{`${i + 1}. ${
                              item.fullName
                            }`}</td>
                            <td className={styles.checkbox}>
                              <Input checked={item.isCaptain} type="checkbox" />
                            </td>
                            <td>
                              <IconX />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  )
}
