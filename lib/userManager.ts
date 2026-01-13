import { Collection, Db, ObjectId } from 'mongodb'
import { connectToDatabase } from './mongodb'

export interface User {
  _id?: ObjectId
  email: string
  name?: string
  phone: string
  isAdmin: boolean
  isActive: boolean
  isBanned: boolean
  isApproved: boolean
  isVerified: boolean
  bannedAt?: Date
  bannedReason?: string
  approvedAt?: Date
  approvedBy?: ObjectId
  createdAt: Date
  lastLogin: Date
}

function getUsersCollection(db: Db): Collection<User> {
  return db.collection<User>('users')
}

/**
 * 전체 사용자 목록 조회 (필터링, 검색, 페이지네이션)
 */
export async function getAllUsers(
  filters?: {
    search?: string
    status?: 'all' | 'active' | 'inactive' | 'banned'
    role?: 'all' | 'admin' | 'user'
    approved?: 'all' | 'approved' | 'pending'
  },
  pagination?: {
    page?: number
    limit?: number
  }
): Promise<{ users: User[]; total: number }> {
  try {
    const { db } = await connectToDatabase()
    const collection = getUsersCollection(db)

    const { search = '', status = 'all', role = 'all', approved = 'all' } = filters || {}
    const { page = 1, limit = 20 } = pagination || {}

    const query: any = {}

    if (status === 'active') {
      query.isActive = true
      query.isBanned = false
    } else if (status === 'inactive') {
      query.isActive = false
      query.isBanned = false
    } else if (status === 'banned') {
      query.isBanned = true
    }

    if (role === 'admin') {
      query.isAdmin = true
    } else if (role === 'user') {
      query.isAdmin = false
    }

    if (approved === 'approved') {
      query.isApproved = true
    } else if (approved === 'pending') {
      query.isApproved = false
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const total = await collection.countDocuments(query)

    const skip = (page - 1) * limit
    const users = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({ password: 0 })
      .toArray() as any[]

    return { users, total }
  } catch (error) {
    console.error('❌ getAllUsers 실패:', error)
    return { users: [], total: 0 }
  }
}

/**
 * 사용자 차단
 */
export async function banUser(
  userId: ObjectId | string,
  reason: string
): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const collection = getUsersCollection(db)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId.toString()) },
      {
        $set: {
          isBanned: true,
          bannedAt: new Date(),
          bannedReason: reason,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (result) {
      console.log(`✅ 사용자 차단: ${userId}`)
    }
    return result !== null
  } catch (error) {
    console.error('❌ banUser 실패:', error)
    return false
  }
}

/**
 * 사용자 차단 해제
 */
export async function unbanUser(userId: ObjectId | string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const collection = getUsersCollection(db)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId.toString()) },
      {
        $set: {
          isBanned: false,
          updatedAt: new Date(),
        },
        $unset: {
          bannedAt: '',
          bannedReason: '',
        },
      },
      { returnDocument: 'after' }
    )

    if (result) {
      console.log(`✅ 사용자 차단 해제: ${userId}`)
    }
    return result !== null
  } catch (error) {
    console.error('❌ unbanUser 실패:', error)
    return false
  }
}

/**
 * 사용자 활성화/비활성화
 */
export async function toggleUserActive(
  userId: ObjectId | string,
  isActive: boolean
): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const collection = getUsersCollection(db)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId.toString()) },
      {
        $set: {
          isActive,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (result) {
      console.log(`✅ 사용자 ${isActive ? '활성화' : '비활성화'}: ${userId}`)
    }
    return result !== null
  } catch (error) {
    console.error('❌ toggleUserActive 실패:', error)
    return false
  }
}

/**
 * 사용자 승인
 */
export async function approveUser(userId: ObjectId | string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const collection = getUsersCollection(db)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId.toString()) },
      {
        $set: {
          isApproved: true,
          approvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (result) {
      console.log(`✅ 사용자 승인: ${userId}`)
    }
    return result !== null
  } catch (error) {
    console.error('❌ approveUser 실패:', error)
    return false
  }
}

/**
 * 사용자 거절
 */
export async function rejectUser(
  userId: ObjectId | string,
  reason: string
): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const collection = getUsersCollection(db)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId.toString()) },
      {
        $set: {
          isApproved: false,
          rejectionReason: reason,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (result) {
      console.log(`✅ 사용자 거절: ${userId}`)
    }
    return result !== null
  } catch (error) {
    console.error('❌ rejectUser 실패:', error)
    return false
  }
}
