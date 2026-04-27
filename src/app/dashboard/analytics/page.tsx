'use client'
import { Topbar } from '@/components/layout/topbar'
import { GACorrelationChart } from '@/components/charts/kpi-charts'
import { useAnalytics } from '@/hooks/use-kpi-data'
import { useTranslations, useLocale } from 'next-intl'
import { cn, formatDuration } from '@/lib/utils'

export default function AnalyticsPage() {
  const t = useTranslations('analytics')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const { data, isLoading } = useAnalytics()

  const agg = data?.aggregated
  const correlation = data?.correlation || []
  const isLive = data?.isLive ?? false

  return (
    <div>
      <Topbar pageKey="analytics" />
      <div className="p-6">
        {/* Live / Mock badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className={cn(
            'rounded-full border px-2.5 py-1 text-xs font-bold',
            isLive
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
          )}>
            {isLive ? '● Live' : '● Mock'} {isAr ? 'بيانات' : 'Data'}
          </span>
          <span className="text-xs text-slate-500">
            {isAr ? 'Google Analytics' : 'Google Analytics'} ·{' '}
            {isAr ? 'آخر 7 أيام' : 'Last 7 days'}
          </span>
        </div>

        {isLoading && (
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-brand-card" />
            ))}
          </div>
        )}

        {agg && (
          <>
            {/* GA metric tiles */}
            <div className="mb-5 grid grid-cols-4 gap-4 animate-fade-in-up">
              <MetricTile
                label={t('sessions')}
                value={agg.sessions.toLocaleString()}
                sub={isAr ? 'إجمالي الجلسات' : 'Total sessions'}
              />
              <MetricTile
                label={t('conversion')}
                value={`${agg.conversionRate.toFixed(1)}%`}
                sub={isAr ? 'معدل تحويل الجلسة' : 'Session conversion rate'}
              />
              <MetricTile
                label={t('bounce_rate')}
                value={`${agg.bounceRate.toFixed(1)}%`}
                sub={isAr ? 'متوسط الأسبوع' : 'Weekly average'}
              />
              <MetricTile
                label={t('avg_session')}
                value={formatDuration(agg.avgSessionDuration)}
                sub={isAr ? 'متوسط مدة الجلسة' : 'Average session duration'}
              />
            </div>

            {/* Correlation chart */}
            {correlation.length > 0 && (
              <div className="mb-5 rounded-2xl border border-brand-border bg-brand-card p-5 animate-fade-in-up">
                <div className="mb-1 text-sm font-bold text-white">{t('traffic_correlation')}</div>
                <p className="mb-4 text-xs text-slate-400">{t('weekly_sessions')}</p>
                <GACorrelationChart data={correlation} height={220} />
                <div className="mt-3 flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500/60" />
                    {isAr ? 'جلسات (×1000)' : 'Sessions (÷1000)'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500/60" />
                    {isAr ? 'عمليات (×100)' : 'Transactions (÷100)'}
                  </div>
                </div>
              </div>
            )}

            {/* Daily breakdown table */}
            {data?.metrics && (
              <div className="rounded-2xl border border-brand-border bg-brand-card p-5 animate-fade-in-up">
                <div className="mb-4 text-sm font-bold text-white">
                  {isAr ? 'تفصيل يومي' : 'Daily Breakdown'}
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-left">
                      {[isAr ? 'التاريخ' : 'Date', isAr ? 'الجلسات' : 'Sessions', isAr ? 'المستخدمون' : 'Users', isAr ? 'التحويل' : 'Conv %', isAr ? 'الارتداد' : 'Bounce %', isAr ? 'المدة' : 'Duration'].map((h) => (
                        <th key={h} className="pb-2.5 text-slate-500 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {data.metrics.map((m) => (
                      <tr key={m.date}>
                        <td className="py-2.5 text-slate-300">
                          {new Date(m.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-SA', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </td>
                        <td className="py-2.5 font-mono text-white">{m.sessions.toLocaleString()}</td>
                        <td className="py-2.5 font-mono text-slate-300">{m.users.toLocaleString()}</td>
                        <td className="py-2.5 font-mono text-brand-emerald">{m.conversionRate.toFixed(1)}%</td>
                        <td className="py-2.5 font-mono text-slate-300">{m.bounceRate.toFixed(1)}%</td>
                        <td className="py-2.5 font-mono text-slate-300">{formatDuration(Math.round(m.avgSessionDuration))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* AI insight */}
            <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-950/15 p-4 animate-fade-in-up">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 pulse-dot" />
                {isAr ? 'رؤية الذكاء الاصطناعي' : 'AI Insight'}
              </div>
              <p className="text-sm text-slate-300">
                {isAr
                  ? `الارتباط بين الجلسات والعمليات قوي (r ≈ 0.94). أيام الأسبوع تحقق تحويلاً أعلى بـ12% من عطلة نهاية الأسبوع. التركيز على جذب حركة الأيام الأسبوعية B2B.`
                  : `Traffic-to-transaction correlation is strong (r ≈ 0.94). Weekdays convert 12% higher than weekends. Focus paid acquisition on B2B weekday traffic patterns.`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetricTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="font-mono text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  )
}
