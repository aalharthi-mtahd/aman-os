'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

const DEMO_ACCOUNTS = [
  { email: 'ceo@aman.sa', role: 'CEO' },
  { email: 'cto@aman.sa', role: 'CTO' },
  { email: 'coo@aman.sa', role: 'COO' },
  { email: 'bd1@aman.sa', role: 'BD' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const locale = useLocale()
  const isAr = locale === 'ar'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError(isAr ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password')
    } else {
      router.push(`/${locale}/dashboard`)
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail)
    setPassword('Aman@2024!')
    setError('')
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-brand-dark bg-grid-pattern"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/5 blur-3xl" />

      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green to-brand-emerald text-2xl font-black text-white shadow-lg shadow-emerald-900/30">
            أ
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isAr ? 'مرحباً بعودتك' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isAr ? 'نظام التشغيل الذكي · أمان' : 'AI Operating System · Aman'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-2xl border border-brand-border bg-brand-card p-5 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                {isAr ? 'البريد الإلكتروني' : 'Email address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={cn(
                  'w-full rounded-xl border border-brand-border bg-black/30 px-4 py-2.5',
                  'text-sm text-white placeholder:text-slate-600',
                  'focus:border-brand-emerald focus:outline-none',
                  isAr && 'text-right'
                )}
                placeholder="ceo@aman.sa"
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={cn(
                  'w-full rounded-xl border border-brand-border bg-black/30 px-4 py-2.5',
                  'text-sm text-white placeholder:text-slate-600',
                  'focus:border-brand-emerald focus:outline-none'
                )}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/25 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full rounded-xl py-3 text-sm font-bold transition-all',
                loading
                  ? 'cursor-not-allowed bg-brand-card2 text-slate-500'
                  : 'bg-gradient-to-r from-brand-green to-brand-emerald text-white hover:opacity-90'
              )}
            >
              {loading
                ? isAr ? 'جارٍ الدخول...' : 'Signing in...'
                : isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Demo accounts */}
        <div className="mt-4 rounded-2xl border border-brand-border bg-brand-card/50 p-4">
          <p className="mb-3 text-center text-xs text-slate-500">
            {isAr ? 'حسابات تجريبية (كلمة المرور: Aman@2024!)' : 'Demo accounts (password: Aman@2024!)'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc.email)}
                className="rounded-lg border border-brand-border bg-brand-card2 px-3 py-2 text-xs transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
              >
                <div className="font-bold text-brand-emerald">{acc.role}</div>
                <div className="truncate text-slate-500">{acc.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language switch */}
        <div className="mt-4 flex justify-center gap-3">
          {(['en', 'ar'] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                const path = window.location.pathname.replace(/^\/(en|ar)/, '')
                window.location.href = `/${l}${path || '/login'}`
              }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-bold transition-colors',
                locale === l
                  ? 'bg-brand-green text-white'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              {l === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
