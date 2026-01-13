'use client'

import './UserFilters.css'

interface UserFiltersProps {
  search: string
  setSearch: (value: string) => void
  status: string
  setStatus: (value: string) => void
  role: string
  setRole: (value: string) => void
  approved: string
  setApproved: (value: string) => void
  onReset: () => void
}

export default function UserFilters({
  search,
  setSearch,
  status,
  setStatus,
  role,
  setRole,
  approved,
  setApproved,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="filters-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="이름, 이메일, 전화번호로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-group">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="banned">차단</option>
        </select>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="filter-select"
        >
          <option value="all">전체 권한</option>
          <option value="admin">관리자</option>
          <option value="user">일반 사용자</option>
        </select>

        <select
          value={approved}
          onChange={(e) => setApproved(e.target.value)}
          className="filter-select"
        >
          <option value="all">전체 승인 상태</option>
          <option value="approved">승인됨</option>
          <option value="pending">대기중</option>
        </select>

        <button onClick={onReset} className="btn btn-gray btn-sm">
          초기화
        </button>
      </div>
    </div>
  )
}
