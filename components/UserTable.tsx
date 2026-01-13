'use client'

import { useState } from 'react'
import UserModal from './modals/UserModal'
import BanModal from './modals/BanModal'
import ApproveModal from './modals/ApproveModal'
import './UserTable.css'

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

interface UserTableProps {
  users: User[]
  onRefresh: () => void
}

export default function UserTable({ users, onRefresh }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [banModal, setBanModal] = useState({ show: false, userId: '' })
  const [approveModal, setApproveModal] = useState({ show: false, userId: '' })
  const [actionLoading, setActionLoading] = useState(false)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (user: User) => {
    if (user.isBanned) {
      return <span className="badge badge-danger">차단</span>
    }
    if (!user.isActive) {
      return <span className="badge badge-gray">비활성</span>
    }
    return <span className="badge badge-success">활성</span>
  }

  const getApprovedBadge = (user: User) => {
    if (user.isApproved) {
      return <span className="badge badge-success">승인됨</span>
    }
    return <span className="badge badge-warning">대기중</span>
  }

  const handleBan = async (userId: string, reason: string) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason }),
      })

      if (response.ok) {
        onRefresh()
        setBanModal({ show: false, userId: '' })
      } else {
        alert('차단에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnban = async (userId: string) => {
    if (!confirm('정말 차단을 해제하시겠습니까?')) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/users/unban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        onRefresh()
      } else {
        alert('차단 해제에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/users/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        onRefresh()
        setApproveModal({ show: false, userId: '' })
      } else {
        alert('승인에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    if (!confirm(`정말 사용자를 ${isActive ? '비활성화' : '활성화'}하시겠습니까?`)) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/users/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !isActive }),
      })

      if (response.ok) {
        onRefresh()
      } else {
        alert('상태 변경에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>상태</th>
              <th>권한</th>
              <th>승인</th>
              <th>가입일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="user-name-button"
                  >
                    {user.name || '-'}
                  </button>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{getStatusBadge(user)}</td>
                <td>{user.isAdmin ? '관리자' : '일반'}</td>
                <td>{getApprovedBadge(user)}</td>
                <td className="text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    {user.isBanned ? (
                      <button
                        onClick={() => handleUnban(user._id)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading}
                      >
                        해제
                      </button>
                    ) : (
                      <button
                        onClick={() => setBanModal({ show: true, userId: user._id })}
                        className="btn btn-danger btn-sm"
                        disabled={actionLoading}
                      >
                        차단
                      </button>
                    )}

                    {!user.isApproved && (
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading}
                      >
                        승인
                      </button>
                    )}

                    {user.isActive ? (
                      <button
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                        className="btn btn-gray btn-sm"
                        disabled={actionLoading}
                      >
                        비활성화
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading}
                      >
                        활성화
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {banModal.show && (
        <BanModal
          onClose={() => setBanModal({ show: false, userId: '' })}
          onBan={(reason) => handleBan(banModal.userId, reason)}
          loading={actionLoading}
        />
      )}

      {approveModal.show && (
        <ApproveModal
          onClose={() => setApproveModal({ show: false, userId: '' })}
          onApprove={() => handleApprove(approveModal.userId)}
          loading={actionLoading}
        />
      )}
    </>
  )
}
