'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import UserTable from '@/components/UserTable'
import UserFilters from '@/components/UserFilters'
import './users.css'

interface User {
  _id: string
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
  createdAt: Date
  lastLogin: Date
}

interface ApiResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 필터 상태
  const [search, setSearch] = useState('')
  const [status_filter, setStatusFilter] = useState('all')
  const [role_filter, setRoleFilter] = useState('all')
  const [approved_filter, setApprovedFilter] = useState('all')

  // 페이지네이션
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)

  // 권한 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/login')
    }
  }, [status, session, router])

  // 사용자 목록 조회
  useEffect(() => {
    fetchUsers()
  }, [search, status_filter, role_filter, approved_filter, page])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        search,
        status: status_filter,
        role: role_filter,
        approved: approved_filter,
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(`/api/admin/users/list?${params}`)

      if (!response.ok) {
        throw new Error('사용자 목록을 불러올 수 없습니다.')
      }

      const data: ApiResponse = await response.json()
      setUsers(data.users)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="spinner"></div>
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="users-page">
      <Header />

      <div className="users-container">
        <div className="users-header">
          <h1>사용자 관리</h1>
          <p className="text-gray-600">총 {total}명의 사용자</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <UserFilters
          search={search}
          setSearch={setSearch}
          status={status_filter}
          setStatus={setStatusFilter}
          role={role_filter}
          setRole={setRoleFilter}
          approved={approved_filter}
          setApproved={setApprovedFilter}
          onReset={() => {
            setSearch('')
            setStatusFilter('all')
            setRoleFilter('all')
            setApprovedFilter('all')
            setPage(1)
          }}
        />

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>사용자를 불러오는 중...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <UserTable users={users} onRefresh={fetchUsers} />

            {/* 페이지네이션 */}
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-gray btn-sm"
              >
                이전
              </button>
              <span className="pagination-info">
                {page} / {Math.ceil(total / limit)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
                className="btn btn-gray btn-sm"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
