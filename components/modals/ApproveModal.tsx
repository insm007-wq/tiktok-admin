'use client'

import './Modal.css'

interface ApproveModalProps {
  onClose: () => void
  onApprove: () => void
  loading: boolean
}

export default function ApproveModal({ onClose, onApprove, loading }: ApproveModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>사용자 승인</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <div className="modal-body">
          <p>이 사용자를 승인하시겠습니까?</p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
            승인 후 사용자는 서비스를 이용할 수 있습니다.
          </p>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-gray"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={onApprove}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '처리 중...' : '승인'}
          </button>
        </div>
      </div>
    </div>
  )
}
