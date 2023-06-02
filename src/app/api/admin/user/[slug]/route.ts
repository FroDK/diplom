import { NextResponse } from 'next/server'
import { adminAuthClient } from '@/shared/supabase/supabaseAdminClient'
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { slug: string }
  }
) {
  const slug = params.slug

  const { error } = await adminAuthClient.deleteUser(slug)

  if (error) {
    return NextResponse.json({
      success: true,
      message: error.message,
    })
  }

  return NextResponse.json({
    success: true,
    message: 'Пользователь успешно удален',
  })
}
