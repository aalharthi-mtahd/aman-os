'use client'
import { Topbar } from '@/components/layout/topbar'
import { useTranslations, useLocale } from 'next-intl'
import { cn, getStatusColor, getStatusBg } from '@/lib/utils'
import { CURRENT_WEEKLY_PLAN } from '@/lib/db/mock-data'

export default function WeekPage() {
  const t = useTranslations('week')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const plan = CURRENT_WEEKLY_PLAN

  return (
    <div>
      <Topbar pageKey="week" />
      <div className="p-6">
        {/* Focus of week — full-width hero */}
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-950/25 to-transparent p-6 animate-fade-in-up">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
            {t('one_thing')}
          </div>
          <p className="text-xl font-bold text-white">
            {isAr ? plan.focusOfWeekAr : plan.focusOfWeek}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 animate-fade-in-up">
          {/* KPI Review */}
          <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="mb-4 text-sm font-bold text-white">{t('kpi_review')}</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="pb-2 text-left font-semibold text-slate-500">{isAr ? 'المؤشر' : 'Metric'}</th>
                  <th className="pb-2 text-right font-semibold text-slate-500">{isAr ? 'الهدف' : 'Target'}</th>
                  <th className="pb-2 text-right font-semibold text-slate-500">{isAr ? 'الفعلي' : 'Actual'}</th>
                  <th className="pb-2 text-right font-semibold text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {plan.kpiReview.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-medium text-slate-300">{item.metric}</td>
                    <td className="py-2.5 text-right font-mono text-slate-400">{item.target.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-white">{item.actual.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold',
                          item.status === 'GREEN' && 'bg-green-500/15 text-green-400',
                          item.status === 'YELLOW' && 'bg-yellow-500/15 text-yellow-400',
                          item.status === 'RED' && 'bg-red-500/15 text-red-400'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Problems Log */}
          <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="mb-4 text-sm font-bold text-white">{t('problems')}</div>
            <div className="space-y-3">
              {plan.problems.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    'rounded-xl border p-3',
                    p.priority === 'P1' && 'border-red-500/25 bg-red-950/10',
                    p.priority === 'P2' && 'border-yellow-500/25 bg-yellow-950/10',
                    p.priority === 'P3' && 'border-brand-border bg-black/20'
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-bold',
                        p.priority === 'P1' && 'bg-red-500/20 text-red-400',
                        p.priority === 'P2' && 'bg-yellow-500/20 text-yellow-400',
                        p.priority === 'P3' && 'bg-slate-500/20 text-slate-400'
                      )}
                    >
                      {p.priority}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold',
                        p.status === 'OPEN' && 'text-red-400',
                        p.status === 'IN_PROGRESS' && 'text-yellow-400',
                        p.status === 'RESOLVED' && 'text-green-400'
                      )}
                    >
                      {isAr
                        ? p.status === 'OPEN' ? 'مفتوح' : p.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'محلول'
                        : p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isAr ? p.descriptionAr : p.description}
                  </p>
                  {p.owner && (
                    <div className="mt-1 text-[10px] text-slate-500">
                      {isAr ? 'المالك:' : 'Owner:'} <span className="font-bold text-brand-emerald">{p.owner}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Kill List */}
          <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="mb-4 text-sm font-bold text-white">{t('kill_list')}</div>
            <ul className="space-y-2">
              {(isAr ? plan.killListAr : plan.killList).map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xs font-bold text-red-400">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Decisions */}
          <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="mb-4 text-sm font-bold text-white">{t('decisions')}</div>
            <div className="space-y-2.5">
              {plan.decisions.map((d) => (
                <div key={d.id} className="flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      'mt-0.5 h-2 w-2 flex-shrink-0 rounded-full',
                      d.status === 'DONE' ? 'bg-green-400' : 'bg-yellow-400'
                    )}
                  />
                  <div>
                    <p className="text-slate-200">{isAr ? d.descriptionAr : d.description}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>{d.decidedBy}</span>
                      <span>·</span>
                      <span>{new Date(d.decidedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-SA')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
