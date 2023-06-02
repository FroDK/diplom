import styles from '@/app/(auth)/auth.module.css'
import Image from 'next/image'
import { Typography } from 'antd'

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className={styles.formContent}>{children}</div>
      <div className={styles.formImage}>
        <Image
          src="/images/sign_in_pc.png"
          alt="test"
          width={600}
          height={590}
        />
      </div>
    </>
  )
}
