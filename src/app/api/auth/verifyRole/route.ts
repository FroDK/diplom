import { NextResponse } from 'next/server'
// @ts-ignore
import jwt from 'jsonwebtoken'
// @ts-ignore
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  const decoded = jwt.verify(token, process.env.ROLE_KEY)

  return NextResponse.json({
    success: true,
    role: decoded.role,
  })
}
