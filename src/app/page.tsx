// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { getLocale } from 'next-intl/server'

export default async function RootPage() {
  const session = await getServerSession(authOptions)
  const locale = await getLocale()

  if (session) {
    redirect(`/${locale}/dashboard`)
  } else {
    redirect(`/${locale}/login`)
  }
}
