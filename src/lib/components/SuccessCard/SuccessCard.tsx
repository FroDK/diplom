import { memo } from 'react'

import CardWrapper from '../CardWrapper/CardWrapper'
import cn from 'classnames'

import styles from './styles.module.scss'
import { ISuccessCardProps } from './types'
import IconSircleOk from '../../../ui/icons/IconSircleOk'
import { Button, Typography } from 'antd'
import { useRouter } from 'next/navigation'

const SuccessCard = ({
  title,
  description,
  leftTitleButton,
  rightTitleButton,
  leftButtonClassName,
  rightButtonClassName,
  handleClick,
  className,
  classDescriptionName,
  fullSize = false,
}: ISuccessCardProps) => {
  const classCardNames = cn(styles.card, className)
  const classDescriptionNames = cn(styles.description, classDescriptionName)
  const router = useRouter()

  const onBack = () => {
    router.push('/dashboard/criteria-assessment')
  }

  return (
    <CardWrapper className={classCardNames}>
      <Typography>{title}</Typography>
      <IconSircleOk />
      <Typography className={classDescriptionNames}>{description}</Typography>

      <div className={styles.buttons}>
        <Button onClick={handleClick} style={{color: '#fff', background: '#625FDA'}} className={leftButtonClassName}>{leftTitleButton}</Button>
        <Button onClick={onBack} style={{color: '#625FDA', borderColor: '#625FDA'}} className={rightButtonClassName}>
          {rightTitleButton}
        </Button>
      </div>
    </CardWrapper>
  )
}

export default memo(SuccessCard)
