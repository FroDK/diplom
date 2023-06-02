import { memo, ReactNode } from 'react'

import cn from 'classnames'

import styles from './styles.module.scss'

export interface CardWrapperProps {
  children: ReactNode
  py?: number
  px?: number
  className?: string
  fullWidth?: boolean
}

const CardWrapper = ({
  children,
  py = 30,
  px = 30,
  className,
  fullWidth,
}: CardWrapperProps) => (
  <div
    className={cn(styles.wrapper, className, {
      [styles.fullWidth]: fullWidth,
    })}
    style={{
      padding: `${py}px ${px}px`,
    }}>
    {children}
  </div>
)

export default memo(CardWrapper)
