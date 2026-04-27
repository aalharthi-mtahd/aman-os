'use client'
import { Topbar } from '@/components/layout/topbar'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { EXPERIMENTS } from '@/lib/db/mock-data'

export default function ExperimentsPage() {
  const t = useTranslations('experiments')
  const locale = useLocale()
  const isAr = locale === 'ar'

  const running = EXPERIMENTS.filter((e) => e.status === 'RUNNING')
  const completed = EXPERIMENTS.filter((e) => e.status === 'COMPLETE')

  const verdictColors = {
    KEEP: 'bg-green-500/15 text-green-400 border-green-500/30',
    KILL: 'bg-red-500/15 text-red-400 border-red-500/30',
    REVIEW: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    undefined: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  }

  return (
    <div>
      <Topbar pageKey="experiments" />
      <div className="p-6">
        {/* Running */}
        {running.length > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400 pulse-dot" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                {isAr ? 'جارية الآن' : 'Running Now'}
              </h2>
            </div>
            <div className="space-y-3">
              {running.map((exp) => (
                <ExpRow key={exp.id} exp={exp} isAr={isAr} t={t} verdictColors={verdictColors} />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        <div className="animate-fade-in-up">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            {isAr ? 'مكتملة' : 'Completed'}
          </div>
          <div className="space-y-3">
            {completed.map((exp) => (
              <ExpRow key={exp.id} exp={exp} isAr={isAr} t={t} verdictColors={verdictColors} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExpRow({ exp, isAr, t, verdictColors }: {
  exp: typeof EXPERIMENTS[0]
  isAr: boolean
  t: ReturnType<typeof useTranslations>
  verdictColors: Record<string, string>
}) {
  const impact = exp.kpiImpactActual ?? null
  const expected = exp.kpiImpactExpected
  const hitRate = impact !== null ? (impact / expected) * 100 : null

  return (
    <div
      className={cn(
        'rounded-2xl border bg-brand-card p-5',
        exp.status === 'RUNNING' ? 'border-blue-500/25' : 'border-brand-border'
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            {isAr ? exp.hypothesisAr : exp.hypothesis}
          </p>
          <div className="mt-1 text-xs text-slate-500">
            {t('kpi_target')}: <span className="text-slate-300">{exp.kpiTarget}</span>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {exp.verdict && (
            <span className={cn('rounded-full border px-2.5 py-1 text-xs font-bold', verdictColors[exp.verdict])}>
              {t(exp.verdict.toLowerCase() as 'keep' | 'kill' | 'review')}
            </span>
          )}
          {exp.status === 'RUNNING' && (
            <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-xs font-bold text-blue-400">
              {t('running')}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-slate-500">{t('impact')} {isAr ? 'المتوقع' : 'Expected'}</div>
          <div className="font-mono font-bold text-slate-200">
            {expected > 0 ? '+' : ''}{expected.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-slate-500">{t('impact')} {isAr ? 'الفعلي' : 'Actual'}</div>
          <div className={cn(
            'font-mono font-bold',
            impact === null ? 'text-slate-500' :
            impact > 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {impact !== null ? `${impact > 0 ? '+' : ''}${impact.toFixed(1)}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-slate-500">{isAr ? 'معدل الإنجاز' : 'Hit Rate'}</div>
          <div className={cn(
            'font-mono font-bold',
            hitRate === null ? 'text-slate-500' :
            hitRate >= 80 ? 'text-green-400' :
            hitRate >= 50 ? 'text-yellow-400' : 'text-red-400'
          )}>
            {hitRate !== null ? `${Math.round(hitRate)}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-slate-500">{isAr ? 'تاريخ البدء' : 'Started'}</div>
          <div className="font-semibold text-slate-300">
            {new Date(exp.startDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-SA', {
              month: 'short', day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
