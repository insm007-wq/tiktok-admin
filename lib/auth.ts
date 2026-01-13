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
      credentials: {
        email: { label: 'Email', type: 'email' },
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
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
})
