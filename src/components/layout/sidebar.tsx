'use client'
// src/components/layout/sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { key: 'dashboard', path: '/dashboard', icon: '⌘', badge: null, group: 'command' },
  { key: 'ai_analyst', path: '/dashboard/ai', icon: '🧠', badge: null, group: 'command' },
  { key: 'forecast', path: '/dashboard/forecast', icon: '🔮', badge: null, group: 'command' },
  { key: 'coach', path: '/dashboard/coach', icon: '🚀', badge: null, group: 'operations' },
  { key: 'team', path: '/dashboard/team', icon: '👥', badge: null, group: 'operations' },
  { key: 'week', path: '/dashboard/week', icon: '🔥', badge: '3', group: 'operations' },
  { key: 'experiments', path: '/dashboard/experiments', icon: '🧪', badge: null, group: 'growth' },
  { key: 'analytics', path: '/dashboard/analytics', icon: '📡', badge: null, group: 'growth' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()
  const { data: session } = useSession()
  const isAr = locale === 'ar'

  function handleLanguageChange(newLocale: string) {
    const path = pathname.replace(/^\/(en|ar)/, '') || '/'
    window.location.href = `/${newLocale}${path}`
  }

  const commandItems = NAV_ITEMS.filter((i) => i.group === 'command')
  const operationsItems = NAV_ITEMS.filter((i) => i.group === 'operations')
  const growthItems = NAV_ITEMS.filter((i) => i.group === 'growth')

  return (
    <aside
      className={cn(
        'fixed top-0 z-50 flex h-screen w-[220px] flex-col',
        'border-brand-border bg-brand-card',
        isAr ? 'right-0 border-l' : 'left-0 border-r'
      )}
    >
      {/* Logo */}
      <div className="border-b border-brand-border px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green to-brand-emerald text-sm font-black text-white">
            أ
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">
              {t('app.name')}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              {t('app.company')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <NavGroup label={t('nav.command_center')}>
          {commandItems.map((item) => (
            <NavItem
              key={item.key}
              href={`/${locale}${item.path}`}
              icon={item.icon}
              label={t(`nav.${item.key}`)}
              badge={item.badge}
              active={pathname === `/${locale}${item.path}` || pathname === item.path}
              isAr={isAr}
            />
          ))}
        </NavGroup>

        <NavGroup label={t('nav.operations')}>
          {operationsItems.map((item) => (
            <NavItem
              key={item.key}
              href={`/${locale}${item.path}`}
              icon={item.icon}
              label={t(`nav.${item.key}`)}
              badge={item.badge}
              active={pathname.includes(item.path) && item.path !== '/dashboard'}
              isAr={isAr}
            />
          ))}
        </NavGroup>

        <NavGroup label={t('nav.growth')}>
          {growthItems.map((item) => (
            <NavItem
              key={item.key}
              href={`/${locale}${item.path}`}
              icon={item.icon}
              label={t(`nav.${item.key}`)}
              badge={item.badge}
              active={pathname.includes(item.path)}
              isAr={isAr}
            />
          ))}
        </NavGroup>
      </nav>

      {/* Footer */}
      <div className="border-t border-brand-border p-3 space-y-3">
        {/* User info */}
        {session?.user && (
          <div className="rounded-xl border border-brand-border bg-black/20 p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                {session.user.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-white">
                  {isAr ? session.user.nameAr : session.user.name}
                </div>
                <div className="text-[10px] font-bold text-brand-emerald">
                  {session.user.role}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="rounded p-1 text-slate-500 transition-colors hover:text-red-400"
                title="Sign out"
              >
                ⇥
              </button>
            </div>
          </div>
        )}

        {/* Language Toggle */}
        <div className="flex rounded-lg bg-black/30 p-1">
          <button
            onClick={() => handleLanguageChange('en')}
            className={cn(
              'flex-1 rounded-md py-1.5 text-xs font-bold transition-all',
              !isAr
                ? 'bg-brand-green text-white'
                : 'text-slate-400 hover:text-white'
            )}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange('ar')}
            className={cn(
              'flex-1 rounded-md py-1.5 text-xs font-bold transition-all',
              isAr
                ? 'bg-brand-green text-white'
                : 'text-slate-400 hover:text-white'
            )}
          >
            عربي
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  badge,
  active,
  isAr,
}: {
  href: string
  icon: string
  label: string
  badge: string | null
  active: boolean
  isAr: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'sidebar-nav-item flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm',
        active
          ? 'border border-emerald-500/20 bg-emerald-500/10 font-semibold text-brand-emerald'
          : 'text-slate-400 hover:bg-brand-card2 hover:text-slate-200'
      )}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  )
}
