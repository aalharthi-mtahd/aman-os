// src/app/dashboard/layout.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/auth-options'
import { Sidebar } from '@/components/layout/sidebar'
import { getLocale } from 'next-intl/server'
import { cn } from '@/lib/utils'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const locale = await getLocale()
  const isRtl = locale === 'ar'

  return (
    <div className="flex min-h-screen bg-brand-dark">
      <Sidebar />
      <main
        className={cn(
          'flex-1 min-h-screen',
          isRtl ? 'mr-[220px]' : 'ml-[220px]'
        )}
      >
        {children}
      </main>
    </div>
  )
}
