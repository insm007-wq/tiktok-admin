import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verifyPassword } from './auth/password'
import { getUserById } from './auth/getUserById'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name?: string
    isAdmin: boolean
  }

  interface Session {
    user: User
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const email = credentials.email as string
          const password = credentials.password as string

          const user = await getUserById(email)

          if (!user) {
            return null
          }

          if (!user.password) {
            return null
          }

          const isPasswordValid = await verifyPassword(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // 관리자만 접근 가능
          if (!user.isAdmin) {
            return null
          }

          console.log(`✅ Admin 로그인 성공: ${email}`)

          return {
            id: user._id?.toString() || email,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
          }
        } catch (error) {
          console.error('❌ 인증 중 오류:', error)
          return null
        }
      },
    }),
  ],

  logger: {
    error(error) {
      if (error.name === 'CredentialsSignin') {
        console.warn('[Auth] 로그인 실패 - 잘못된 자격 증명')
        return
      }
      console.error(`[Auth Error] ${error.name}: ${error.message}`)
      if (error.stack) {
        console.error(error.stack)
      }
    },
    warn(code) {
      console.warn(`[Auth Warning] ${code}`)
    },
    debug(message, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Auth Debug]', message, metadata)
      }
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.isAdmin = user.isAdmin
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string | undefined
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
})
