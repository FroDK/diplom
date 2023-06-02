'use client'

import { StyleProvider } from '@ant-design/cssinjs'
import SupabaseProvider from '@/init/providers/supabase-provider'

// @ts-ignore
export function Providers({ children }) {
  return (
    <SupabaseProvider>
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </SupabaseProvider>
  )
}
