import IconOk from '@/ui/icons/IconOk'
import { Modal } from '../Modal'

import styles from './styles.module.scss'
import { Typography } from 'antd'
import { ITeam } from '@/widgets/CreationTeams/CreationTeams'

interface IShowTeamProps {
  showModal: boolean
  onClose: () => void
  data?: ITeam
}

const ShowTeam = ({ showModal, onClose, data }: IShowTeamProps) => {
  if (!data) {
    return null
  }

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      title={`Команда: ${data.name}`}
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
            {data.team_member.map((item, i) => {
              return (
                <tr key={i}>
                  <td className={styles.fullName}>{`${i + 1}. ${
                    item.user?.fio
                  }`}</td>
                  <td>{item.is_captain && <IconOk />}</td>
                  <td>{item.user?.email}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      }
    />
  )
}

export default ShowTeam
