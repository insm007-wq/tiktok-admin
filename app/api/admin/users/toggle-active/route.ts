import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { toggleUserActive } from '@/lib/userManager'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: '관리자만 접근 가능합니다.' }, { status: 403 })
    }

    const { userId, isActive } = await request.json()

    if (!userId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: '사용자 ID와 활성화 여부가 필요합니다.' },
        { status: 400 }
      )
    }

    const success = await toggleUserActive(userId, isActive)

    if (!success) {
      return NextResponse.json(
        { error: '사용자 상태 변경에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `사용자를 ${isActive ? '활성화' : '비활성화'}했습니다.`,
    })
  } catch (error) {
    console.error('❌ POST /api/admin/users/toggle-active 실패:', error)
    return NextResponse.json(
      { error: '사용자 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
