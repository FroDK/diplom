interface ICommonField {
  key: string
  label?: string
  placeholder: string
}

export interface IFieldBoolean extends ICommonField {
  type: 'boolean'
}

export interface IFieldNumber extends ICommonField {
  type: 'number'
  min?: number
  max?: number
  float?: boolean
}

export interface IFieldString extends ICommonField {
  type: 'string'
}

interface IFieldSelectOption {
  label: string
  value: string | number
}

export interface IFieldSelect extends ICommonField {
  type: 'select'
  options: IFieldSelectOption[]
}

export type IField =
  | IFieldBoolean
  | IFieldNumber
  | IFieldString
  | IFieldSelectOption
  | IFieldSelect

export interface IForm {
  fields: IField[]
  // title / description and so on
}
