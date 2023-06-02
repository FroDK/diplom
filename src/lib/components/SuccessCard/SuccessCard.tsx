import { memo } from 'react'

import CardWrapper from '../CardWrapper/CardWrapper'
import cn from 'classnames'

import styles from './styles.module.scss'
import { ISuccessCardProps } from './types'
import IconSircleOk from '../../../ui/icons/IconSircleOk'
import { Button, Typography } from 'antd'

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
  return (
    <CardWrapper className={classCardNames}>
      <Typography>{title}</Typography>
      <IconSircleOk />
      <Typography className={classDescriptionNames}>{description}</Typography>

      <div className={styles.buttons}>
        <Button className={leftButtonClassName}>{leftTitleButton}</Button>
        <Button className={rightButtonClassName} onClick={handleClick}>
          {rightTitleButton}
        </Button>
      </div>
    </CardWrapper>
  )
}

export default memo(SuccessCard)
