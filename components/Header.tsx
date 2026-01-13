'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import './Header.css'

export default function Header() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: true, redirectUrl: '/login' })
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link href="/users" className="header-logo">
            TikTok Admin
          </Link>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-email">{session?.user?.email}</span>
            <span className="user-role">관리자</span>
          </div>
          <button onClick={handleLogout} className="btn btn-gray btn-sm">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
