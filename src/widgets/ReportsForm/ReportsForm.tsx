'use client'

import { Button, Card, Col, Form, Row, Select, Space } from 'antd'
import { useCallback } from 'react'
import { utils, writeFile } from 'xlsx'
import { useSupabase } from '@/init/providers/supabase-provider'
import _, { forEach } from 'lodash'
import { log } from 'util'
import { ERoles, ERolesLocalize } from '@/widgets/Dashboard/models/navItems'
import { undefined } from 'zod'

export const ReportsForm = ({
  contests,
  experts,
  typeContests,
  user,
}: {
  contests: any[]
  experts: any[]
  typeContests: any[]
  user: any
}) => {
  const { supabase } = useSupabase()

  const onFormReportByContestFinish = useCallback(
    async (values: any) => {
      const contest = contests.find((contest) => contest.id === values.contest)

      const { data: listOfTeams, error } = await supabase
        .from('team')
        .select(
          'id, name, team_member(is_captain, user(fio, email, user_role))'
        )
        .eq('contest', contest.id)

      const modules = contest.form_answers.teamMarks
      const experts = contest.form_answers.rateUser

      const sumRates = _(modules)
        .groupBy('team') // группируем модули по полю 'team'
        .map((modules, teamId) => ({
          id: teamId,
          // @ts-ignore
          name: _.find(listOfTeams, { id: teamId }).name, // находим имя команды по id
          ratesSum: _.sumBy(modules, 'rates'), // считаем сумму баллов из 'rates' внутри каждой группы модулей
        }))
        .value()

      const dataToExcel = sumRates.map((sum) => ({
        'Название команды': sum.name,
        'Сумма баллов': sum.ratesSum,
      }))

      const teamWithMaxRates = _.maxBy(sumRates, 'ratesSum')
      const winTeam = {
        'Название команды победителя': teamWithMaxRates!.name,
      }

      const participants = _(listOfTeams)
        .flatMap('team_member')
        .map((member) => {
          // @ts-ignore
          member.user.user_role = ERolesLocalize[member.user.user_role]
          return member.user
        })
        .value()

      const participantsFormatted = participants.map((item) => ({
        ФИО: item.fio,
        'E-mail': item.email,
        Роль: item.user_role,
      }))

      // @ts-ignore
      const expertsFormatted = experts.map((exp) => ({
        ФИО: exp.fio,
        'E-mail': exp.email,
      }))

      const teamSheet = utils.json_to_sheet(dataToExcel)
      const winnerTeamSheet = utils.json_to_sheet([winTeam])
      const participantSheet = utils.json_to_sheet(participantsFormatted)
      const expertSheet = utils.json_to_sheet(expertsFormatted)

      let a = utils.sheet_to_json(teamSheet, { header: 1 })
      let b = utils.sheet_to_json(winnerTeamSheet, { header: 1 })
      let c = utils.sheet_to_json(participantSheet, { header: 1 })
      let d = utils.sheet_to_json(expertSheet, { header: 1 })

      a = a.concat(['']).concat(b).concat(['']).concat(c).concat(['']).concat(d)

      let worksheet = utils.json_to_sheet(a, { skipHeader: true })

      const workbook = utils.book_new()
      utils.book_append_sheet(workbook, worksheet, contest.title)

      writeFile(
        workbook,
        `${contest.title}-${new Date(
          contest.created_at
        ).toLocaleDateString()}.xlsx`
      )
    },
    [contests, supabase]
  )

  const onFormReportByExpert = useCallback(
    (values: any) => {
      const expert = experts.find((contest) => contest.id === values.expert)

      const contestsWithExpert = _.filter(contests, (contest) => {
        const rateUsers = _.get(contest, 'form_answers.rateUser', [])
        return _.some(rateUsers, { id: expert.id })
      })

      console.log('contestsWithExpert:', contestsWithExpert)

      const expertContestData = _.map(contestsWithExpert, (contest) => {
        const expertTmp = _.find(contest.form_answers.rateUser, {
          id: expert.id,
        })

        return {
          'ФИО Эксперта': expertTmp.fio,
          'Почта Эксперта': expertTmp.email,
          'Название чемпионата': contest.title,
          'Дата проведения': contest.created_at,
          'Тип чемпионата': contest.type_contest.name,
        }
      })

      console.log('expertContestData:', expertContestData)

      const expertSheet = utils.json_to_sheet(expertContestData)

      const workbook = utils.book_new()
      utils.book_append_sheet(workbook, expertSheet, expert.fio)

      writeFile(workbook, `${expert.fio}.xlsx`)
    },
    [contests, experts]
  )

  const onFormReportByTypeOfContestFinish = useCallback(
    async (values: any) => {
      const typeContestId = values.typeContest

      const nameOfTypeContest = typeContests.find(
        (typeContest) => typeContest.id === values.typeContest
      )

      const filteredContests = _.filter(contests, (contest) => {
        return _.get(contest, 'type_contest.id') === typeContestId
      })

      console.log('filteredContests:', filteredContests)

      const workbook = utils.book_new()

      // ------------------------------------------------------------------------------
      for (const contest of filteredContests) {
        const { data: listOfTeams, error } = await supabase
          .from('team')
          .select(
            'id, name, team_member(is_captain, user(fio, email, user_role))'
          )
          .eq('contest', contest.id)

        console.log('listOfTeams:', listOfTeams)

        const modules = contest.form_answers.teamMarks
        const experts = contest.form_answers.rateUser

        const sumRates = _(modules)
          .groupBy('team') // группируем модули по полю 'team'
          .map((modules, teamId) => ({
            id: teamId,
            // @ts-ignore
            name: _.find(listOfTeams, { id: teamId }).name, // находим имя команды по id
            ratesSum: _.sumBy(modules, 'rates'), // считаем сумму баллов из 'rates' внутри каждой группы модулей
          }))
          .value()

        const dataToExcel = sumRates.map((sum) => ({
          'Название команды': sum.name,
          'Сумма баллов': sum.ratesSum,
        }))

        const teamWithMaxRates = _.maxBy(sumRates, 'ratesSum')
        const winTeam = {
          'Название команды победителя': undefined,
          [teamWithMaxRates!.name]: undefined,
        }

        const participants = _(listOfTeams)
          .flatMap('team_member')
          .map((member) => {
            // @ts-ignore
            member.user.user_role = ERolesLocalize[member.user.user_role]
            return member.user
          })
          .value()

        console.log('participants:', participants)

        const participantsFormatted = participants.map((item) => ({
          ФИО: item.fio,
          'E-mail': item.email,
          Роль: item.user_role,
        }))

        // @ts-ignore
        const expertsFormatted = experts.map((exp) => ({
          ФИО: exp.fio,
          'E-mail': exp.email,
        }))

        const nameDateData = {
          'Название битвы': contest.title,
          'Место проведения': `${contest.country}, ${contest.city}, ${contest.address}`,
        }

        const expertsHeader = { Эксперты: undefined }

        const nameDateSheet = utils.json_to_sheet([nameDateData])
        const teamSheet = utils.json_to_sheet(dataToExcel)
        const winnerTeamSheet = utils.json_to_sheet([winTeam])
        const participantSheet = utils.json_to_sheet(participantsFormatted)
        const expertSheet = utils.json_to_sheet(expertsFormatted)
        const expertHeaderSheet = utils.json_to_sheet([expertsHeader])

        let a = utils.sheet_to_json(nameDateSheet, { header: 1 })
        let b = utils.sheet_to_json(teamSheet, { header: 1 })
        let c = utils.sheet_to_json(winnerTeamSheet, { header: 1 })
        let d = utils.sheet_to_json(participantSheet, { header: 1 })
        let e = utils.sheet_to_json(expertHeaderSheet, { header: 1 })
        let f = utils.sheet_to_json(expertSheet, { header: 1 })

        a = a
          .concat([''])
          .concat(b)
          .concat([''])
          .concat(c)
          .concat(d)
          .concat([''])
          .concat(e)
          .concat(f)

        let worksheet = utils.json_to_sheet(a, { skipHeader: true })

        utils.book_append_sheet(workbook, worksheet, contest.title)
      }

      // @ts-ignore
      writeFile(workbook, `${nameOfTypeContest.name}.xlsx`)
    },
    [contests, supabase, typeContests]
  )

  console.log('contests:', contests)
  console.log('typeContests:', typeContests)
  console.log('user:', user)

  const isAdmin = user.app_metadata.claims_admin
  const userRole = isAdmin ? ERoles.ADMIN : user.app_metadata.user_role

  return (
    <>
      <Row gutter={[16, 16]}>
        {userRole === ERoles.CHAIRMAN && (
          <Col span={12}>
            <Card title="Отчет по конкретной битве" bordered={false}>
              <Row>
                <Form
                  autoComplete="off"
                  onFinish={onFormReportByContestFinish}
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Form.Item
                    name="contest"
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[{ required: true, message: 'Выберите битву' }]}
                  >
                    <Select>
                      {contests.map((contest) => (
                        <Select.Option key={contest.id} value={contest.id}>
                          {contest.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ margin: 0 }}
                    >
                      Скачать
                    </Button>
                  </Form.Item>
                </Form>
              </Row>
            </Card>
          </Col>
        )}
        {isAdmin && (
          <Col span={12}>
            <Card title="Отчет по битвам конкретного типа" bordered={false}>
              <Row>
                <Form
                  autoComplete="off"
                  onFinish={onFormReportByTypeOfContestFinish}
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Form.Item
                    name="typeContest"
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[{ required: true, message: 'Выберите тип' }]}
                  >
                    <Select>
                      {typeContests.map((typeContest) => (
                        <Select.Option
                          key={typeContest.id}
                          value={typeContest.id}
                        >
                          {typeContest.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ margin: 0 }}
                    >
                      Скачать
                    </Button>
                  </Form.Item>
                </Form>
              </Row>
            </Card>
          </Col>
        )}
        {(userRole === ERoles.EXPERT || isAdmin) && (
          <Col span={12}>
            <Card title="Отчет по конкретному эксперту" bordered={false}>
              <Row>
                <Form
                  autoComplete="off"
                  onFinish={onFormReportByExpert}
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Form.Item
                    name="expert"
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[{ required: true, message: 'Выберите эксперта' }]}
                  >
                    <Select>
                      {experts.map((expert) => (
                        <Select.Option key={expert.id} value={expert.id}>
                          {expert.fio}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ margin: 0 }}
                    >
                      Скачать
                    </Button>
                  </Form.Item>
                </Form>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </>
  )
}
