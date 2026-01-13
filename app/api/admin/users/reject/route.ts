import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { rejectUser } from '@/lib/userManager'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: '관리자만 접근 가능합니다.' }, { status: 403 })
    }

    const { userId, reason } = await request.json()

    if (!userId || !reason || reason.trim() === '') {
      return NextResponse.json(
        { error: '사용자 ID와 거절 사유가 필요합니다.' },
        { status: 400 }
      )
    }

    const success = await rejectUser(userId, reason)

    if (!success) {
      return NextResponse.json(
        { error: '사용자 거절에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: '사용자를 거절했습니다.' })
  } catch (error) {
    console.error('❌ POST /api/admin/users/reject 실패:', error)
    return NextResponse.json(
      { error: '사용자 거절 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
