import { ERoles } from '@/widgets/Dashboard/models/navItems'

export enum EContestStatus {
  NOT_START = 'not_start',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export const ContestStatusLocalize = {
  [EContestStatus.NOT_START]: 'Не начат',
  [EContestStatus.IN_PROGRESS]: 'В процессе',
  [EContestStatus.COMPLETED]: 'Завершен',
}
