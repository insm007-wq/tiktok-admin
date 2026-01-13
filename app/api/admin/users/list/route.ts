import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllUsers } from '@/lib/userManager'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: '관리자만 접근 가능합니다.' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = (searchParams.get('status') || 'all') as any
    const role = (searchParams.get('role') || 'all') as any
    const approved = (searchParams.get('approved') || 'all') as any
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const { users, total } = await getAllUsers(
      { search, status, role, approved },
      { page, limit }
    )

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('❌ GET /api/admin/users/list 실패:', error)
    return NextResponse.json(
      { error: '사용자 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
