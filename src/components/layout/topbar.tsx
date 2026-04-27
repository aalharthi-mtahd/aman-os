'use client'
// src/components/layout/topbar.tsx
import { useLocale, useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'

interface TopbarProps {
  pageKey: string
}

export function Topbar({ pageKey }: TopbarProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { data: session } = useSession()
  const isAr = locale === 'ar'

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-brand-border bg-brand-dark/90 px-6 backdrop-blur-xl">
      <h1 className="text-lg font-bold text-white">
        {t(`pages.${pageKey}`)}
      </h1>

      <div className="flex items-center gap-3">
        {/* Alert bell */}
        <button className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand-card2 hover:text-white">
          <span className="text-lg">🔔</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-brand-dark bg-red-500" />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2 rounded-full border border-brand-border bg-brand-card2 py-1.5 pl-1.5 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-semibold text-white">
            {isAr ? session?.user?.nameAr : session?.user?.name}
          </span>
          <span className="text-xs font-bold text-brand-emerald">
            {session?.user?.role}
          </span>
        </div>
      </div>
    </header>
  )
}
