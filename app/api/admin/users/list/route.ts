import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('users')

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = (searchParams.get('status') || 'all') as any
    const role = (searchParams.get('role') || 'all') as any
    const approved = (searchParams.get('approved') || 'all') as any
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // 쿼리 조건 구성
    const query: any = {}

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      query.$or = [
        { email: searchRegex },
        { name: searchRegex },
        { phone: searchRegex },
      ]
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true
        query.isBanned = false
      } else if (status === 'inactive') {
        query.isActive = false
      } else if (status === 'banned') {
        query.isBanned = true
      }
    }

    if (role && role !== 'all') {
      query.isAdmin = role === 'admin'
    }

    if (approved && approved !== 'all') {
      query.isApproved = approved === 'approved'
    }

    const users = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await collection.countDocuments(query)

    // 비밀번호 필드 제외
    const usersWithoutPassword = users.map((user: any) => {
      const { password, ...rest } = user
      return rest
    })

    return NextResponse.json({
      success: true,
      users: usersWithoutPassword,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('❌ GET /api/admin/users/list 실패:', error)
    return NextResponse.json(
      { error: '사용자 목록 조회 중 오류가 발생했습니다.', details: String(error) },
      { status: 500 }
    )
  }
}
