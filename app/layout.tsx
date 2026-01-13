import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'TikTok Admin - 사용자 관리',
  description: '사용자 관리 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
