import { NextResponse } from 'next/server'
// @ts-ignore
import jwt from 'jsonwebtoken'
// @ts-ignore
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')

  const payload = {
    role,
  }

  const token = jwt.sign(payload, process.env.ROLE_KEY, {
    expiresIn: 3600, // 1 hour in seconds
  })

  return NextResponse.json({
    success: true,
    token,
  })
}
