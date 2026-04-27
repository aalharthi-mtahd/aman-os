'use client'
// src/app/dashboard/page.tsx
import { Topbar } from '@/components/layout/topbar'
import { KPICard } from '@/components/ui/kpi-card'
import { AIBrain } from '@/components/ui/ai-brain'
import { AlertBanner } from '@/components/ui/alert-banner'
import { TransactionChart, CompletionRateChart } from '@/components/charts/kpi-charts'
import { useKPIData, useAIAnalysis } from '@/hooks/use-kpi-data'
import { useTranslations, useLocale } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === 'ar'

  const { data: kpiData, isLoading: kpiLoading } = useKPIData()
  const { data: analysis, isLoading: analysisLoading } = useAIAnalysis()

  const kpi = kpiData?.current
  const deltas = kpiData?.deltas
  const alerts = kpiData?.alerts || []
  const historical = kpiData?.historical || []

  // 🔥 SAFE DELTAS (FIX FOR TYPESCRIPT)
  const transactionsDelta = deltas?.transactions
    ? {
        value: deltas.transactions.value ?? 0,
        percentage: deltas.transactions.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.transactions.direction)
          ? deltas.transactions.direction
          : "stable",
      }
    : undefined;

  const gmvDelta = deltas?.gmv
    ? {
        value: deltas.gmv.value ?? 0,
        percentage: deltas.gmv.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.gmv.direction)
          ? deltas.gmv.direction
          : "stable",
      }
    : undefined;

  const revenueDelta = deltas?.revenue
    ? {
        value: deltas.revenue.value ?? 0,
        percentage: deltas.revenue.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.revenue.direction)
          ? deltas.revenue.direction
          : "stable",
      }
    : undefined;

  const completionDelta = deltas?.completionRate
    ? {
        value: deltas.completionRate.value ?? 0,
        percentage: deltas.completionRate.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.completionRate.direction)
          ? deltas.completionRate.direction
          : "stable",
      }
    : undefined;

  const wauDelta = deltas?.wau
    ? {
        value: deltas.wau.value ?? 0,
        percentage: deltas.wau.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.wau.direction)
          ? deltas.wau.direction
          : "stable",
      }
    : undefined;

  const repeatRateDelta = deltas?.repeatRate
    ? {
        value: deltas.repeatRate.value ?? 0,
        percentage: deltas.repeatRate.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.repeatRate.direction)
          ? deltas.repeatRate.direction
          : "stable",
      }
    : undefined;

  const disputeRateDelta = deltas?.disputeRate
    ? {
        value: deltas.disputeRate.value ?? 0,
        percentage: deltas.disputeRate.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.disputeRate.direction)
          ? deltas.disputeRate.direction
          : "stable",
      }
    : undefined;

  const conversionDelta = deltas?.conversionRate
    ? {
        value: deltas.conversionRate.value ?? 0,
        percentage: deltas.conversionRate.percentage ?? 0,
        direction: ["up", "down", "stable"].includes(deltas.conversionRate.direction)
          ? deltas.conversionRate.direction
          : "stable",
      }
    : undefined;

  return (
    <div>
      <Topbar pageKey="dashboard" />
      <div className="p-6">

        {alerts.length > 0 && <AlertBanner alerts={alerts} />}

        {/* PRIMARY KPI */}
        <div className="mb-4 grid grid-cols-4 gap-4 animate-fade-in-up">

          <KPICard
            label={t('kpi.transactions')}
            value={kpi?.transactions ?? 7284}
            format="number"
            delta={transactionsDelta}
            deltaLabel={t('kpi.vs_last_week')}
            variant="green"
            size="lg"
          />

          <KPICard
            label={t('kpi.gmv')}
            value={kpi?.gmv ?? 1274700}
            format="currency-compact"
            delta={gmvDelta}
            deltaLabel={t('kpi.vs_last_week')}
            variant="blue"
            size="lg"
          />

          <KPICard
            label={t('kpi.revenue')}
            value={kpi?.revenue ?? 70109}
            format="currency-compact"
            delta={revenueDelta}
            deltaLabel={t('kpi.vs_last_week')}
            variant="gold"
            size="lg"
          />

          <KPICard
            label={t('kpi.completion_rate')}
            value={kpi?.completionRate ?? 67.4}
            format="percent"
            delta={completionDelta}
            deltaLabel={t('kpi.critical')}
            variant="red"
            size="lg"
            critical
          />

        </div>

        {/* SECONDARY KPI */}
        <div className="mb-5 grid grid-cols-5 gap-3 animate-fade-in-up">

          <KPICard label={t('kpi.wau')} value={kpi?.wau ?? 14820} format="number-compact" delta={wauDelta} size="sm" />

          <KPICard label={t('kpi.repeat_rate')} value={kpi?.repeatRate ?? 23.8} format="percent" delta={repeatRateDelta} size="sm" />

          <KPICard label={t('kpi.take_rate')} value={kpi?.takeRate ?? 5.5} format="percent" size="sm" />

          <KPICard label={t('kpi.dispute_rate')} value={kpi?.disputeRate ?? 4.1} format="percent" delta={disputeRateDelta} variant="red" size="sm" critical />

          <KPICard label={t('kpi.conversion')} value={kpi?.conversionRate ?? 31.2} format="percent" delta={conversionDelta} size="sm" />

        </div>

        {/* AI */}
        {analysis && !analysisLoading && (
          <div className="mb-5 animate-fade-in-up">
            <AIBrain analysis={analysis} mode="full" />
          </div>
        )}

        {kpiLoading && !kpiData && (
          <div className="mb-5 h-48 animate-pulse rounded-2xl bg-brand-card" />
        )}

        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">

          <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="mb-1 text-sm font-bold text-white">
              {t('kpi.transactions')}
            </div>
            <div className="mb-4 text-xs text-slate-400">
              {isAr ? 'آخر 8 أسابيع' : 'Last 8 weeks'}
            </div>

            {historical.length > 0
              ? <TransactionChart data={historical.slice(-8)} />
              : <div className="h-[220px] animate-pulse rounded-xl bg-brand-card2" />
            }
          </div>

          <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div className="mb-1 text-sm font-bold text-white">
              {t('kpi.completion_rate')}
            </div>
            <div className="mb-4 text-xs text-slate-400">
              {isAr ? '8 أسابيع · خط هدف 70%' : '8-week trend · 70% target line'}
            </div>

            {historical.length > 0
              ? <CompletionRateChart data={historical.slice(-8)} />
              : <div className="h-[220px] animate-pulse rounded-xl bg-brand-card2" />
            }
          </div>

        </div>

      </div>
    </div>
  )
}