'use client'

import { useState } from 'react'
import './Modal.css'

interface BanModalProps {
  onClose: () => void
  onBan: (reason: string) => void
  loading: boolean
}

export default function BanModal({ onClose, onBan, loading }: BanModalProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reason.trim()) {
      onBan(reason)
      setReason('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>사용자 차단</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-field">
              <label htmlFor="reason">차단 사유 *</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="차단 사유를 입력해주세요"
                className="modal-textarea"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-gray"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={loading || !reason.trim()}
            >
              {loading ? '처리 중...' : '차단'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal.css에 추가할 스타일
const styles = `
.modal-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.modal-textarea:focus {
  outline: none;
  border-color: #1a1a1a;
}

.modal-textarea:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
`
