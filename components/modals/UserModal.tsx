'use client'

import '../modals/Modal.css'

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

interface UserModalProps {
  user: User
  onClose: () => void
}

export default function UserModal({ user, onClose }: UserModalProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>사용자 상세 정보</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>이름</label>
            <p>{user.name || '-'}</p>
          </div>

          <div className="modal-field">
            <label>이메일</label>
            <p>{user.email}</p>
          </div>

          <div className="modal-field">
            <label>전화번호</label>
            <p>{user.phone}</p>
          </div>

          <div className="modal-field">
            <label>권한</label>
            <p>{user.isAdmin ? '관리자' : '일반 사용자'}</p>
          </div>

          <div className="modal-field">
            <label>계정 상태</label>
            <p>
              {user.isBanned && <span className="badge badge-danger">차단</span>}
              {!user.isBanned && !user.isActive && <span className="badge badge-gray">비활성</span>}
              {!user.isBanned && user.isActive && <span className="badge badge-success">활성</span>}
            </p>
          </div>

          <div className="modal-field">
            <label>승인 상태</label>
            <p>
              {user.isApproved ? (
                <span className="badge badge-success">승인됨</span>
              ) : (
                <span className="badge badge-warning">대기중</span>
              )}
            </p>
          </div>

          <div className="modal-field">
            <label>SMS 인증</label>
            <p>
              {user.isVerified ? (
                <span className="badge badge-success">완료</span>
              ) : (
                <span className="badge badge-warning">미완료</span>
              )}
            </p>
          </div>

          <div className="modal-field">
            <label>가입일</label>
            <p>{formatDate(user.createdAt)}</p>
          </div>

          <div className="modal-field">
            <label>마지막 로그인</label>
            <p>{formatDate(user.lastLogin)}</p>
          </div>

          {user.isBanned && user.bannedReason && (
            <div className="modal-field">
              <label>차단 사유</label>
              <p className="text-danger">{user.bannedReason}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-gray">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
