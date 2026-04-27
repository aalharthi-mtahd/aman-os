'use client'
// src/app/dashboard/ai/page.tsx
import { Topbar } from '@/components/layout/topbar'
import { AIBrain, HealthScoreBadge } from '@/components/ui/ai-brain'
import { KPICard } from '@/components/ui/kpi-card'
import { useAIAnalysis, useKPIData } from '@/hooks/use-kpi-data'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

export default function AIAnalystPage() {
  const t = useTranslations('ai')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const { data: analysis, isLoading } = useAIAnalysis()
  const { data: kpiData } = useKPIData()

  const kpi = kpiData?.current

  return (
    <div>
      <Topbar pageKey="ai_analyst" />
      <div className="p-6">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-brand-card" />
            ))}
          </div>
        )}

        {analysis && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Full AI Brain */}
            <AIBrain analysis={analysis} mode="full" />

            {/* Deep Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('pattern_detected')}
                </div>
                <p className="text-sm leading-relaxed text-slate-200">
                  {isAr
                    ? 'فشل العمليات يبلغ ذروته بين 2-5 مساءً بتوقيت الخليج. على الأرجح انتهاء مهلة بوابة الدفع. إصلاح اتفاقية مستوى الخدمة مع المزود فوراً.'
                    : 'Transaction failures peak between 2PM–5PM Gulf time. Likely payment gateway timeout. Fix SLA with gateway provider immediately.'}
                </p>
              </div>
              <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('revenue_leak')}
                </div>
                <p className="text-sm leading-relaxed text-slate-200">
                  {isAr
                    ? `بنسبة الإتمام الحالية ${kpi?.completionRate ?? 67.4}%: خسارة 18,400 ريال/أسبوع. استرداد كامل = +27,000 ريال/أسبوع في إمكانية الإيرادات.`
                    : `At current ${kpi?.completionRate ?? 67.4}% completion: losing ﹤18,400/week in failed GMV. Full recovery = +﹤27K/week revenue potential.`}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-2xl border border-yellow-500/30 p-5',
                  'bg-gradient-to-br from-yellow-950/20 to-transparent'
                )}
              >
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-yellow-400">
                  {t('ai_verdict')}
                </div>
                <p className="text-sm font-semibold leading-relaxed text-white">
                  {isAr
                    ? 'مشكلة احتفاظ متنكرة في هيئة مشكلة نمو. أصلح الأساس، النمو يتبع تلقائياً.'
                    : 'You have a retention problem disguised as a growth problem. Fix the foundation, growth follows automatically.'}
                </p>
              </div>
            </div>

            {/* Health Score + Status Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-card p-5">
                <HealthScoreBadge score={analysis.healthScore} />
              </div>
              <KPICard
                label={isAr ? 'زخم النمو' : 'GROWTH MOMENTUM'}
                value={kpi?.growthRate ?? 8.2}
                format="percent"
                variant="green"
                size="sm"
              />
              <KPICard
                label={isAr ? 'نقاط الجودة' : 'QUALITY SCORE'}
                value={kpi?.completionRate ?? 67.4}
                format="percent"
                variant="red"
                critical
                size="sm"
              />
              <KPICard
                label={isAr ? 'إمكانية الإيراد' : 'REVENUE POTENTIAL'}
                value={27000}
                format="currency-compact"
                variant="gold"
                size="sm"
              />
            </div>

            {/* Actions Detail */}
            <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
              <div className="mb-4 text-sm font-bold text-white">
                {isAr ? 'خطة العمل المفصلة' : 'Detailed Action Plan'}
              </div>
              <div className="space-y-3">
                {analysis.actions.map((action, i) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 rounded-xl border border-brand-border bg-black/20 p-3.5"
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                        i === 0 && 'bg-emerald-500/20 text-emerald-400',
                        i === 1 && 'bg-blue-500/20 text-blue-400',
                        i === 2 && 'bg-yellow-500/20 text-yellow-400'
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">
                        {isAr ? action.textAr : action.text}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">{isAr ? 'المسؤول:' : 'Owner:'}</span>
                        <span className="text-xs font-bold text-brand-emerald">{action.owner}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
