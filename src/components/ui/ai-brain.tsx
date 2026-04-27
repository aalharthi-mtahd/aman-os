'use client'
// src/components/ui/ai-brain.tsx
import { cn } from '@/lib/utils'
import type { AIAnalysis } from '@/types'
import { useLocale, useTranslations } from 'next-intl'

interface AIBrainProps {
  analysis: AIAnalysis
  mode?: 'snapshot' | 'full'
  className?: string
}

export function AIBrain({ analysis, mode = 'full', className }: AIBrainProps) {
  const locale = useLocale()
  const t = useTranslations('ai')
  const isAr = locale === 'ar'

  const snapshot = isAr ? analysis.snapshotAr : analysis.snapshot
  const biggestProblem = isAr ? analysis.biggestProblemAr : analysis.biggestProblem
  const weeklyFocus = isAr ? analysis.weeklyFocusAr : analysis.weeklyFocus
  const killList = isAr ? analysis.killListAr : analysis.killList
  const actions = analysis.actions

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-emerald-500/25 ai-glow',
        'bg-gradient-to-br from-emerald-950/30 to-blue-950/20',
        className
      )}
    >
      {/* Background glow orb */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/5 blur-2xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {t('weekly_snapshot')}
            </span>
          </div>
          <span className="font-mono text-xs text-slate-500">
            {analysis.generatedAt
              ? new Date(analysis.generatedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-SA', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : ''}
          </span>
        </div>

        {/* Snapshot */}
        <p className="mb-5 text-base font-semibold leading-relaxed text-white">
          {snapshot}
        </p>

        {mode === 'full' && (
          <div className="grid grid-cols-3 gap-3">
            {/* Biggest Problem */}
            <div className="rounded-xl border border-brand-border bg-black/30 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('biggest_problem')}
              </div>
              <p className="text-sm leading-relaxed text-slate-200">{biggestProblem}</p>
            </div>

            {/* Weekly Focus */}
            <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-950/20 to-red-950/10 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                {t('focus_of_week')}
              </div>
              <p className="text-sm font-bold leading-relaxed text-white">{weeklyFocus}</p>
            </div>

            {/* Kill List */}
            <div className="rounded-xl border border-brand-border bg-black/30 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('kill_list')}
              </div>
              <ul className="space-y-1.5">
                {killList.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <span className="mt-0.5 font-bold text-red-400">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        {mode === 'full' && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('actions_this_week')}:
            </span>
            {actions.map((action) => (
              <ActionChip key={action.id} action={action} isAr={isAr} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionChip({
  action,
  isAr,
}: {
  action: AIAnalysis['actions'][0]
  isAr: boolean
}) {
  const colors = ['chip-green', 'chip-blue', 'chip-gold']
  const colorClass = colors[action.priority - 1] || colors[0]

  const priorityColors: Record<number, string> = {
    1: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
    2: 'bg-blue-500/12 text-blue-300 border-blue-500/20',
    3: 'bg-yellow-500/12 text-yellow-300 border-yellow-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
        priorityColors[action.priority]
      )}
    >
      <span className="font-bold">①②③'[action.priority - 1]</span>
      {isAr ? action.textAr : action.text}
    </span>
  )
}

// Health Score Badge
export function HealthScoreBadge({ score }: { score: number }) {
  const getLabel = (s: number) => {
    if (s >= 85) return { label: 'Excellent', labelAr: 'ممتاز', color: 'text-green-400' }
    if (s >= 70) return { label: 'Good', labelAr: 'جيد', color: 'text-blue-400' }
    if (s >= 55) return { label: 'Fair', labelAr: 'مقبول', color: 'text-yellow-400' }
    return { label: 'Critical', labelAr: 'حرج', color: 'text-red-400' }
  }

  const { label, color } = getLabel(score)

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-10 w-10">
        <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e2d4d" strokeWidth="2" />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${score} ${100 - score}`}
            className={color}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
          {score}
        </span>
      </div>
      <div>
        <div className={cn('text-sm font-bold', color)}>{label}</div>
        <div className="text-xs text-slate-500">Health Score</div>
      </div>
    </div>
  )
}
