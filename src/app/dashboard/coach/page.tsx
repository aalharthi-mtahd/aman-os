'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { SalesCoachOutput } from '@/types'

type Difficulty = 'easy' | 'medium' | 'hard'

export default function CoachPage() {
  const t = useTranslations('coach')
  const locale = useLocale()
  const isAr = locale === 'ar'

  const [tab, setTab] = useState<'analyze' | 'simulate'>('analyze')
  const [conversation, setConversation] = useState('')
  const [result, setResult] = useState<SalesCoachOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [simDifficulty, setSimDifficulty] = useState<Difficulty>('medium')
  const [simOpener, setSimOpener] = useState('')
  const [simLoading, setSimLoading] = useState(false)

  async function handleAnalyze() {
    if (!conversation.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai/coach?mode=analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation, language: locale }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleSimulate() {
    setSimLoading(true)
    setSimOpener('')
    try {
      const res = await fetch('/api/ai/coach?mode=simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: locale, difficulty: simDifficulty }),
      })
      const data = await res.json()
      setSimOpener(data.opener)
    } finally {
      setSimLoading(false)
    }
  }

  return (
    <div>
      <Topbar pageKey="coach" />
      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-brand-border bg-brand-card p-1 w-fit">
          {(['analyze', 'simulate'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={cn(
                'rounded-lg px-5 py-2 text-sm font-semibold transition-all',
                tab === tabKey
                  ? 'bg-brand-green text-white'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {tabKey === 'analyze' ? (isAr ? 'تحليل' : 'Analyze') : (isAr ? 'محاكاة' : 'Simulate')}
            </button>
          ))}
        </div>

        {tab === 'analyze' && (
          <div className="grid grid-cols-2 gap-5 animate-fade-in-up">
            {/* Input */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
                <div className="mb-3 text-sm font-bold text-white">{t('title')}</div>
                <p className="mb-4 text-xs text-slate-400">{t('subtitle')}</p>
                <textarea
                  value={conversation}
                  onChange={(e) => setConversation(e.target.value)}
                  placeholder={isAr
                    ? 'الصق محادثة المبيعات هنا...\n\nمثال:\nالعميل: رسوم 5.5% غالية جداً، منافسكم يأخذ 3%\nأنا: لكن خدمتنا أفضل...'
                    : 'Paste your sales conversation here...\n\nExample:\nClient: Your 5.5% fee is way too high, competitor charges 3%\nMe: But our service quality is better...'}
                  className={cn(
                    'h-64 w-full resize-none rounded-xl border border-brand-border bg-black/30',
                    'p-4 text-sm text-slate-200 placeholder:text-slate-600',
                    'focus:border-brand-emerald focus:outline-none focus:ring-0',
                    isAr && 'text-right'
                  )}
                  dir={isAr ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!conversation.trim() || loading}
                  className={cn(
                    'mt-3 w-full rounded-xl py-3 text-sm font-bold transition-all',
                    !conversation.trim() || loading
                      ? 'cursor-not-allowed bg-brand-card2 text-slate-500'
                      : 'bg-brand-green text-white hover:bg-emerald-600'
                  )}
                >
                  {loading ? (isAr ? 'جارٍ التحليل...' : 'Analyzing...') : t('analyze_btn')}
                </button>
              </div>
            </div>

            {/* Output */}
            <div>
              {loading && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-brand-card" />
                  ))}
                </div>
              )}
              {!loading && !result && (
                <div className="flex h-full items-center justify-center rounded-2xl border border-brand-border bg-brand-card">
                  <p className="text-sm text-slate-500">{t('placeholder')}</p>
                </div>
              )}
              {result && !loading && (
                <div className="space-y-3 animate-fade-in-up">
                  <CoachBlock
                    label={t('what_went_wrong')}
                    content={result.whatWentWrong}
                    accent="red"
                    icon="⚠"
                  />
                  <CoachBlock
                    label={t('better_script')}
                    content={result.betterScript}
                    accent="emerald"
                    icon="✦"
                  />
                  <CoachBlock
                    label={t('closing_strategy')}
                    content={result.closingStrategy}
                    accent="blue"
                    icon="🎯"
                  />
                  <CoachBlock
                    label={t('next_step')}
                    content={result.nextStep}
                    accent="yellow"
                    icon="→"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'simulate' && (
          <div className="max-w-2xl animate-fade-in-up">
            <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
              <div className="mb-2 text-sm font-bold text-white">{t('simulation_title')}</div>
              <p className="mb-5 text-xs text-slate-400">{t('simulation_sub')}</p>

              {/* Difficulty picker */}
              <div className="mb-5">
                <div className="mb-2 text-xs text-slate-400">
                  {isAr ? 'مستوى الصعوبة' : 'Difficulty Level'}
                </div>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSimDifficulty(d)}
                      className={cn(
                        'flex-1 rounded-lg py-2 text-xs font-bold capitalize transition-all',
                        simDifficulty === d
                          ? d === 'easy'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : d === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-brand-card2 text-slate-400 border border-brand-border'
                      )}
                    >
                      {isAr
                        ? d === 'easy' ? 'سهل' : d === 'medium' ? 'متوسط' : 'صعب'
                        : d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulate}
                disabled={simLoading}
                className="mb-5 w-full rounded-xl bg-brand-green py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
              >
                {simLoading ? '...' : t('simulation_btn')}
              </button>

              {simOpener && (
                <div className="rounded-xl border border-yellow-500/25 bg-yellow-950/20 p-4 animate-fade-in-up">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                    {t('client_says')}
                  </div>
                  <p className={cn('text-sm text-white', isAr && 'text-right')} dir={isAr ? 'rtl' : 'ltr'}>
                    "{simOpener}"
                  </p>
                  <div className="mt-4">
                    <p className="mb-2 text-xs text-slate-500">
                      {isAr ? 'ردّك:' : 'Your response:'}
                    </p>
                    <textarea
                      placeholder={isAr ? 'اكتب ردك هنا...' : 'Type your response here...'}
                      className={cn(
                        'h-32 w-full resize-none rounded-xl border border-brand-border bg-black/30',
                        'p-3 text-sm text-slate-200 placeholder:text-slate-600',
                        'focus:border-brand-emerald focus:outline-none',
                        isAr && 'text-right'
                      )}
                      dir={isAr ? 'rtl' : 'ltr'}
                      onChange={(e) => {
                        if (e.target.value.length > 20) {
                          setConversation(`Client: ${simOpener}\nMe: ${e.target.value}`)
                          setTab('analyze')
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CoachBlock({
  label, content, accent, icon,
}: {
  label: string
  content: string
  accent: 'red' | 'emerald' | 'blue' | 'yellow'
  icon: string
}) {
  const accentMap = {
    red: 'text-red-400 border-red-500/20 bg-red-950/10',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-950/10',
    yellow: 'text-yellow-400 border-yellow-500/20 bg-yellow-950/10',
  }
  return (
    <div className={cn('rounded-2xl border p-4', accentMap[accent])}>
      <div className={cn('mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider')}>
        <span>{icon}</span>
        <span className={accentMap[accent].split(' ')[0]}>{label}</span>
      </div>
      <p className="text-sm leading-relaxed text-slate-200">{content}</p>
    </div>
  )
}
