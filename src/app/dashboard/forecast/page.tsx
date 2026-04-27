'use client'
import { Topbar } from '@/components/layout/topbar'
import { ForecastChart } from '@/components/charts/kpi-charts'
import { useForecast } from '@/hooks/use-kpi-data'
import { useTranslations, useLocale } from 'next-intl'
import { cn, formatNumber, formatCurrency } from '@/lib/utils'

const RISK_COLORS = {
  LOW: 'text-green-400 bg-green-500/10 border-green-500/20',
  MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  HIGH: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function ForecastPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === 'ar'
  const { data, isLoading } = useForecast(true)

  const forecast = data?.forecast
  const ts = data?.timeSeries

  return (
    <div>
      <Topbar pageKey="forecast" />
      <div className="p-6">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-brand-card" />
            ))}
          </div>
        )}

        {forecast && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Header badges */}
            <div className="flex items-center gap-3">
              <span className={cn('rounded-full border px-3 py-1 text-xs font-bold', RISK_COLORS[forecast.riskLevel])}>
                {t('forecast.risk_level')}: {t(`forecast.${forecast.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'}`)}
              </span>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                {t('forecast.confidence')}: {forecast.confidence}%
              </span>
              <span className="text-xs text-slate-500">
                {isAr ? 'الأسبوع القادم' : 'Next week projection'} ·{' '}
                {new Date(forecast.weekStart).toLocaleDateString(isAr ? 'ar-SA' : 'en-SA', {
                  month: 'short', day: 'numeric',
                })}
              </span>
            </div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Best */}
              <ScenarioCard
                label={t('forecast.best_case')}
                transactions={forecast.scenarioBest.transactions}
                growth={forecast.scenarioBest.growthRate}
                gmv={forecast.scenarioBest.gmv}
                revenue={forecast.scenarioBest.revenue}
                conditions={isAr ? forecast.scenarioBest.conditionsAr : forecast.scenarioBest.conditions}
                color="green"
                isAr={isAr}
              />
              {/* Expected */}
              <ScenarioCard
                label={t('forecast.expected_case')}
                transactions={forecast.scenarioExpected.transactions}
                growth={forecast.scenarioExpected.growthRate}
                gmv={forecast.scenarioExpected.gmv}
                revenue={forecast.scenarioExpected.revenue}
                conditions={isAr ? forecast.scenarioExpected.conditionsAr : forecast.scenarioExpected.conditions}
                color="blue"
                isAr={isAr}
                primary
              />
              {/* Worst */}
              <ScenarioCard
                label={t('forecast.worst_case')}
                transactions={forecast.scenarioWorst.transactions}
                growth={forecast.scenarioWorst.growthRate}
                gmv={forecast.scenarioWorst.gmv}
                revenue={forecast.scenarioWorst.revenue}
                conditions={isAr ? forecast.scenarioWorst.conditionsAr : forecast.scenarioWorst.conditions}
                color="red"
                isAr={isAr}
              />
            </div>

            {/* Chart */}
            {ts && (
              <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
                <div className="mb-1 text-sm font-bold text-white">
                  {isAr ? 'نموذج التوقع' : 'Forecast Model'}
                </div>
                <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-0.5 w-4 bg-emerald-400" /> {isAr ? 'الفعلي' : 'Actual'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-green-400" /> {isAr ? 'الأفضل' : 'Best'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-0.5 w-4 bg-blue-400" /> {isAr ? 'المتوقع' : 'Expected'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-red-400" /> {isAr ? 'الأسوأ' : 'Worst'}
                  </span>
                </div>
                <ForecastChart
                  labels={ts.labels}
                  actual={ts.actual}
                  best={ts.best}
                  expected={ts.expected}
                  worst={ts.worst}
                  height={280}
                />
              </div>
            )}

            {/* Two-column: Drivers + Bottlenecks */}
            <div className="grid grid-cols-2 gap-4">
              <ListCard
                title={t('ai.growth_drivers')}
                items={isAr ? forecast.driversAr : forecast.drivers}
                accent="emerald"
                icon="↑"
              />
              <ListCard
                title={t('ai.bottlenecks')}
                items={isAr ? forecast.bottlenecksAr : forecast.bottlenecks}
                accent="red"
                icon="⚠"
              />
            </div>

            {/* Key Action */}
            <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-950/20 to-transparent p-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                {t('ai.key_action')}
              </div>
              <p className="font-semibold text-white">
                {isAr ? forecast.keyActionAr : forecast.keyAction}
              </p>
            </div>

            {/* AI Rationale */}
            <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 pulse-dot" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {t('ai.forecast_rationale')}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {isAr ? forecast.rationaleAr : forecast.rationale}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ScenarioCard({
  label, transactions, growth, gmv, revenue, conditions, color, isAr, primary,
}: {
  label: string
  transactions: number
  growth: number
  gmv: number
  revenue: number
  conditions: string[]
  color: 'green' | 'blue' | 'red'
  isAr: boolean
  primary?: boolean
}) {
  const colorMap = {
    green: {
      border: 'border-green-500/25',
      bg: 'from-green-950/20',
      text: 'text-green-400',
      badge: 'bg-green-500/10 text-green-400',
    },
    blue: {
      border: 'border-blue-500/35',
      bg: 'from-blue-950/30',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400',
    },
    red: {
      border: 'border-red-500/25',
      bg: 'from-red-950/20',
      text: 'text-red-400',
      badge: 'bg-red-500/10 text-red-400',
    },
  }
  const c = colorMap[color]
  const isNeg = growth < 0

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 bg-gradient-to-br to-transparent',
        c.border, c.bg,
        primary && 'ring-1 ring-blue-500/30'
      )}
    >
      <div className={cn('mb-3 text-xs font-bold uppercase tracking-wider', c.text)}>
        {label}
      </div>
      <div className="mb-1 font-mono text-3xl font-black text-white">
        {formatNumber(transactions)}
      </div>
      <div className="mb-4 flex items-center gap-2">
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', c.badge)}>
          {isNeg ? '' : '+'}{growth.toFixed(1)}%
        </span>
        <span className="text-xs text-slate-500">{isAr ? 'نمو' : 'growth'}</span>
      </div>
      <div className="mb-4 space-y-1 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>GMV</span>
          <span className="font-mono font-semibold text-white">{formatCurrency(gmv, true)}</span>
        </div>
        <div className="flex justify-between">
          <span>{isAr ? 'الإيرادات' : 'Revenue'}</span>
          <span className="font-mono font-semibold text-white">{formatCurrency(revenue, true)}</span>
        </div>
      </div>
      <div className="border-t border-white/5 pt-3 space-y-1.5">
        {conditions.map((c, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
            <span className="mt-0.5 text-slate-600">·</span>
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}

function ListCard({
  title, items, accent, icon,
}: {
  title: string
  items: string[]
  accent: 'emerald' | 'red'
  icon: string
}) {
  const colors = {
    emerald: { border: 'border-brand-border', iconColor: 'text-emerald-400', title: 'text-slate-400' },
    red: { border: 'border-brand-border', iconColor: 'text-red-400', title: 'text-slate-400' },
  }
  const c = colors[accent]
  return (
    <div className={cn('rounded-2xl border bg-brand-card p-5', c.border)}>
      <div className={cn('mb-3 text-xs font-bold uppercase tracking-wider', c.title)}>
        {title}
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <span className={cn('mt-0.5 font-bold', c.iconColor)}>{icon}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
