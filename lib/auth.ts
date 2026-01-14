import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'

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

export const auth = async () => {
  const token = await getToken({ req: { cookies: await cookies() } as any })

  if (!token) {
    return null
  }

  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string | undefined,
      isAdmin: token.isAdmin as boolean,
    },
  }
}
