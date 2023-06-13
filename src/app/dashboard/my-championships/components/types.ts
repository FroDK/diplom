import { ICriteriaForm } from '@/widgets/ModuleForm/ModuleForm'

export interface ICreateBattleComponentProps {
  title: string
  battleId: number | string
  status: string
  form: IFormCriteria[]
}

export interface IFormCriteria {
  criteriaForm: ICriteriaForm[]
  description: string
  forId: string
  title: string
}
