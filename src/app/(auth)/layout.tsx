import styles from './auth.module.css'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>{children}</div>
    </div>
  )
}
