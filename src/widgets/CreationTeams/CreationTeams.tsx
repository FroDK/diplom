'use client'

import styles from './styles.module.scss'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import ShowTeam from '@/lib/components/ShowTeam'
import { Modal } from '@/lib/components/Modal'
import { Button, Input, Select, Typography } from 'antd'
import IconX from '@/ui/icons/IconX'
import { useSupabase } from '@/init/providers/supabase-provider'

import cn from 'classnames'

interface IUser {
  id: string
  fio: string
  email: string
}
interface IMember {
  id: string
  is_captain: boolean
  user: IUser
}
export interface ITeam {
  name: string
  id: string
  team_member: IMember[]
}

export interface ICreationTeamsHOCProps {
  contestId: string
  name: string
  date?: string
  type: string
  subType: string
  status: string
}

export interface IRenameTeamParams {
  id: string
  name: string
}

export interface IAddTeamMemberParams {
  teamId: string
  userId: string
}

export interface IRemoveTeamMemberParams {
  teamId: string
  memberId: string
}

export interface ISetCaptainTeamMemberParams {
  teamId: string
  memberId: string
  value: boolean
}

export const CreationTeamsHOC = ({
  contestId,
  date,
  subType,
  type,
  name,
  status,
}: Omit<ICreationTeamsHOCProps, 'users' | 'teams'>) => {
  const supabase = useSupabase()
  const [teams, setTeams] = useState<ITeam[]>([])
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    const init = async () => {
      const [usersInfo, teamsInfo] = await Promise.all([
        supabase.supabase
          .from('contest')
          .select(
            `
            users(
              id,
              fio,
              email,
              user_role,
              phone
            )
          `
          )
          .eq('id', contestId),
        supabase.supabase
          .from('team')
          .select(
            `
              id,
              name,
              team_member(
                id,
                is_captain,
                user
              )
            `
          )
          .eq('contest', contestId),
      ])

      const transformedUsersInfo = (usersInfo.data || [])[0].users.filter(
        (item) => item.user_role === 'participant'
      )

      const transformedTeams = (teamsInfo.data || []).map((item) => {
        return {
          ...item,
          team_member: item.team_member.map((item2) => {
            return {
              ...item2,
              user: transformedUsersInfo.find(
                (item3) => item3.id === item2.user
              ),
            }
          }),
        }
      })

      setUsers(transformedUsersInfo as IUser[])
      setTeams(transformedTeams as ITeam[])
    }

    init()
  }, [])

  const onAddNewTeam = useCallback(async (name: string) => {
    const { data } = await supabase.supabase
      .from('team')
      .insert({
        name,
        contest: contestId,
      })
      .select()

    // @ts-expect-error
    setTeams((val) => [...val, { ...data[0], team_member: [] }])
  }, [])

  const onRemoveTeam = useCallback(async (id: string) => {
    await supabase.supabase.from('team_member').delete().eq('team', id)
    await supabase.supabase.from('team').delete().eq('id', id)

    setTeams((val) => val.filter((item) => item.id !== id))
  }, [])

  const onRenameTeam = useCallback(async ({ name, id }: IRenameTeamParams) => {
    await supabase.supabase
      .from('team')
      .update({
        name,
      })
      .eq('id', id)

    setTeams((val) =>
      val.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name,
          }
        }
        return item
      })
    )
  }, [])

  const onAddTeamMember = useCallback(
    async ({ teamId, userId }: IAddTeamMemberParams) => {
      // guard if user is already present in the team
      const team = teams.find((item) => item.id === teamId) as ITeam
      if (team.team_member.some((item) => item.user.id === userId)) {
        return
      }

      const { data } = await supabase.supabase
        .from('team_member')
        .upsert({
          user: userId,
          is_captain: false,
          team: teamId as string,
        })
        .select()

      // @ts-expect-error
      const memberId = data[0].id
      const userObj = users.find((item) => item.id === userId) as IUser

      setTeams((val) =>
        val.map((item) => {
          if (item.id === teamId) {
            return {
              ...item,
              team_member: [
                ...item.team_member,
                {
                  id: memberId,
                  user: userObj,
                  is_captain: false,
                },
              ],
            }
          }
          return item
        })
      )
    },
    [users, teams]
  )

  const onRemoveTeamMember = useCallback(
    async ({ teamId, memberId }: IRemoveTeamMemberParams) => {
      await supabase.supabase.from('team_member').delete().eq('id', memberId)

      setTeams((val) =>
        val.map((item) => {
          if (item.id === teamId) {
            return {
              ...item,
              team_member: item.team_member.filter(
                (item2) => item2.id !== memberId
              ),
            }
          }
          return item
        })
      )
    },
    []
  )

  const onSetCaptainTeamMember = useCallback(
    async ({ teamId, memberId, value }: ISetCaptainTeamMemberParams) => {
      await supabase.supabase
        .from('team_member')
        .update({
          is_captain: false,
        })
        .eq('team', teamId)

      await supabase.supabase
        .from('team_member')
        .update({
          is_captain: value,
        })
        .eq('id', memberId)

      setTeams((val) =>
        val.map((item) => {
          if (item.id === teamId) {
            return {
              ...item,
              team_member: item.team_member.map((item2) => {
                if (item2.id === memberId) {
                  return {
                    ...item2,
                    is_captain: value,
                  }
                }
                return {
                  ...item2,
                  is_captain: false,
                }
              }),
            }
          }
          return item
        })
      )
    },
    []
  )

  return (
    <CreationTeams
      name={name}
      date={date}
      type={type}
      subType={subType}
      status={status}
      teams={teams}
      users={users}
      onAddNewTeam={onAddNewTeam}
      onRemoveTeam={onRemoveTeam}
      onRenameTeam={onRenameTeam}
      onSetCaptainTeamMember={onSetCaptainTeamMember}
      onAddTeamMember={onAddTeamMember}
      onRemoveTeamMember={onRemoveTeamMember}
    />
  )
}

export interface ICreationTeamsProps
  extends Omit<ICreationTeamsHOCProps, 'contestId'> {
  teams: ITeam[]
  users: IUser[]
  onAddNewTeam: (name: string) => Promise<void>
  onRemoveTeam: (id: string) => Promise<void>
  onRenameTeam: (params: IRenameTeamParams) => Promise<void>
  onAddTeamMember: (params: IAddTeamMemberParams) => Promise<void>
  onRemoveTeamMember: (params: IRemoveTeamMemberParams) => Promise<void>
  onSetCaptainTeamMember: (params: ISetCaptainTeamMemberParams) => Promise<void>
}

export const CreationTeams = ({
  name,
  teams,
  users,
  date,
  status,
  type,
  subType,
  onAddNewTeam,
  onRemoveTeam,
  onRenameTeam,
  onSetCaptainTeamMember,
  onAddTeamMember,
  onRemoveTeamMember,
}: ICreationTeamsProps) => {
  const [teamId, setTeamId] = useState<string | undefined>(undefined)

  const selectedTeam = useMemo(() => {
    return teams.find((item) => item.id === teamId)
  }, [teams, teamId])

  const [showTeam, setShowTeam] = useState(false)
  const openShowTeam = useCallback(
    (teamId: string) => {
      setTeamId(teamId)
      setShowTeam(true)
    },
    [teamId]
  )
  const closeShowTeam = useCallback(() => {
    setShowTeam(false)
  }, [])

  const [renameValue, setRenameValue] = useState<string>('')
  const [showRename, setShowRename] = useState(false)
  const openShowRename = useCallback(
    (teamId: string) => {
      setTeamId(teamId)
      setShowRename(true)

      const team = teams.find((item) => item.id === teamId)
      setRenameValue(team?.name || '')
    },
    [teams]
  )
  const closeShowRename = useCallback(() => {
    setShowRename(false)
    setRenameValue('')
  }, [])

  const handleRenameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value)
  }, [])

  const handleRenameTeam = async () => {
    onRenameTeam({ id: teamId as string, name: renameValue }).then(() => {
      closeShowRename()
    })
  }

  const [showAddMember, setShowAddMember] = useState(false)
  const openAddMember = useCallback((teamId: string) => {
    setTeamId(teamId)
    setShowAddMember(true)
  }, [])
  const closeAddMember = useCallback(() => {
    setShowAddMember(false)
  }, [])
  const handleAddMember = useCallback(
    (userId: string) => {
      onAddTeamMember({
        teamId: teamId as string,
        userId,
      })
    },
    [teamId]
  )

  const handleRemoveMember = useCallback(
    async (id: string) => {
      onRemoveTeamMember({
        teamId: teamId as string,
        memberId: id,
      })
    },
    [teamId]
  )

  const handleSetCaptain = useCallback(
    (id: string, isCaptain: boolean) => {
      onSetCaptainTeamMember({
        teamId: teamId as string,
        memberId: id,
        value: isCaptain,
      })
    },
    [teamId]
  )

  const [showAddTeam, setShowAddTeam] = useState(false)
  const openAddTeam = useCallback(() => {
    setShowAddTeam(true)
  }, [])
  const closeAddTeam = useCallback(() => {
    setShowAddTeam(false)
    setRenameValue('')
  }, [])
  const handleAddTeam = () => {
    onAddNewTeam(renameValue).then(() => {
      closeAddTeam()
    })
  }

  const handleRemoveTeam = useCallback(
    (teamId: string) => {
      onRemoveTeam(teamId)
    },
    [teamId]
  )

  const colorStatus = status === 'in_progress' ? '#4DCB4A' : '#CB4A69'

  return (
    <div
      className={cn(styles.wrapper, status === 'completed' && styles.completed)}
    >
      <div className={styles.info}>
        {date !== undefined && (
          <Typography
            color={'#6e6e6e'}
            style={{
              fontSize: '10px',
              fontWeight: '300',
            }}
          >
            {date}
          </Typography>
        )}
        <Typography
          color={'#6e6e6e'}
          style={{
            fontSize: '10px',
            fontWeight: '300',
          }}
        >
          {`Тип: ${type}`}
        </Typography>
        <Typography
          color={'#6e6e6e'}
          style={{
            fontSize: '10px',
            fontWeight: '300',
          }}
        >
          {`Вид: ${subType}`}
        </Typography>
        <Typography
          style={{
            fontSize: '10px',
            fontWeight: '600',
            color: colorStatus,
          }}
          className="status"
        >
          {status === 'completed'
            ? 'Завершена'
            : status === 'in_progress'
            ? 'В процессе'
            : 'Не начата'}
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
        <Button
          disabled={status === 'completed'}
          className={styles.button}
          onClick={openAddTeam}
        >
          + Добавить команду
        </Button>
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
                <Button
                  disabled={status === 'completed'}
                  className={styles.button}
                  onClick={() => openShowTeam(item.id)}
                  size="small"
                >
                  Посмотреть
                </Button>
                <Button
                  disabled={status === 'completed'}
                  className={styles.button}
                  onClick={() => openShowRename(item.id)}
                  size="small"
                >
                  Редактировать
                </Button>
                <Button
                  disabled={status === 'completed'}
                  className={styles.button}
                  onClick={() => openAddMember(item.id)}
                  size="small"
                >
                  Добавить участника
                </Button>
                <Button
                  disabled={status === 'completed'}
                  className={styles.button}
                  onClick={() => handleRemoveTeam(item.id)}
                  size="small"
                >
                  Удалить
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      {showTeam && (
        <ShowTeam
          showModal={showTeam}
          onClose={closeShowTeam}
          data={selectedTeam}
        />
      )}
      <Modal
        open={showRename || showAddTeam}
        onClose={showAddTeam ? closeAddTeam : closeShowRename}
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
            <Button
              disabled={renameValue.length === 0}
              onClick={showAddTeam ? handleAddTeam : handleRenameTeam}
              className={styles.button}
            >
              {showAddTeam ? 'Добавить' : 'Сохранить'}
            </Button>
          </div>
        }
      />
      {showAddMember && (
        <Modal
          open={showAddMember}
          onClose={closeAddMember}
          title={selectedTeam?.name || ''}
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
                    onSelect={handleAddMember}
                    style={{
                      width: '348px',
                    }}
                    options={users?.map((item) => {
                      return {
                        label: item.fio,
                        value: item.id,
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
                      {selectedTeam?.team_member?.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td className={styles.title}>{`${i + 1}. ${
                              item.user?.fio
                            }`}</td>
                            <td className={styles.checkbox}>
                              <Input
                                onChange={(evt) =>
                                  handleSetCaptain(item.id, evt.target.checked)
                                }
                                checked={item.is_captain}
                                type="checkbox"
                              />
                            </td>
                            <td>
                              <IconX
                                onClick={() => handleRemoveMember(item.id)}
                              />
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
