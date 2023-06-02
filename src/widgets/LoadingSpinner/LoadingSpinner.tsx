'use client'

import { Spin } from 'antd'
import styles from './loading.module.css'
export default function LoadingSpinner() {
  return (
    <div className={styles.wrapper}>
      <Spin />
    </div>
  )
}
