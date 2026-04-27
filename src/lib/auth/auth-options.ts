// src/lib/auth/auth-options.ts
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { USERS, USER_CREDENTIALS } from '@/lib/db/mock-data'
import type { UserRole } from '@/types'

declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
    nameAr: string
  }
  interface Session {
    user: User & {
      id: string
      role: UserRole
      nameAr: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    nameAr: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = USERS.find((u) => u.email === credentials.email)
        if (!user) return null

        const hashedPassword = USER_CREDENTIALS[credentials.email]
        if (!hashedPassword) return null

        // In production, use real bcrypt comparison
        // For demo, accept "Aman@2024!" for all users
        const isValid =
          credentials.password === 'Aman@2024!' ||
          (await bcrypt.compare(credentials.password, hashedPassword).catch(() => false))

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          nameAr: user.nameAr,
          email: user.email,
          role: user.role,
        } as NextAuthUser & { role: UserRole; nameAr: string }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as NextAuthUser & { role: UserRole }).role
        token.nameAr = (user as NextAuthUser & { nameAr: string }).nameAr
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.nameAr = token.nameAr
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}
