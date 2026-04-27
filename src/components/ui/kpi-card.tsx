'use client'
// src/components/ui/kpi-card.tsx
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import type { KPIDelta } from '@/types'

type KPICardVariant = 'green' | 'blue' | 'gold' | 'red' | 'default'

interface KPICardProps {
  label: string
  value: number
  format?: 'number' | 'currency' | 'percent' | 'currency-compact' | 'number-compact'
  delta?: KPIDelta
  deltaLabel?: string
  variant?: KPICardVariant
  size?: 'sm' | 'md' | 'lg'
  critical?: boolean
  className?: string
}

const VARIANT_STYLES: Record<KPICardVariant, string> = {
  green: 'before:from-brand-green before:to-brand-emerald',
  blue: 'before:from-blue-500 before:to-purple-500',
  gold: 'before:from-yellow-500 before:to-orange-500',
  red: 'before:from-red-500 before:to-orange-500',
  default: 'before:from-slate-600 before:to-slate-500',
}

function formatValue(value: number, format: KPICardProps['format']): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value)
    case 'currency-compact':
      return formatCurrency(value, true)
    case 'percent':
      return formatPercent(value)
    case 'number-compact':
      return formatNumber(value, true)
    case 'number':
    default:
      return formatNumber(value)
  }
}

export function KPICard({
  label,
  value,
  format = 'number',
  delta,
  deltaLabel,
  variant = 'default',
  size = 'md',
  critical = false,
  className,
}: KPICardProps) {
  const valueStr = formatValue(value, format)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-brand-card transition-all duration-200',
        'before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r',
        'hover:-translate-y-0.5 hover:border-emerald-500/30 card-glow',
        critical ? 'border-red-500/30' : 'border-brand-border',
        VARIANT_STYLES[variant],
        className
      )}
    >
      <div className={cn('p-5', size === 'sm' && 'p-4')}>
        <div
          className={cn(
            'mb-2 text-xs font-bold uppercase tracking-wider',
            critical ? 'text-red-400' : 'text-slate-400'
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'kpi-value font-mono font-black text-white',
            size === 'lg' && 'text-4xl',
            size === 'md' && 'text-3xl',
            size === 'sm' && 'text-xl'
          )}
        >
          {valueStr}
        </div>
        {delta && (
          <div className="mt-2 flex items-center gap-2">
            <DeltaBadge delta={delta} />
            {deltaLabel && (
              <span className="text-xs text-slate-500">{deltaLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DeltaBadge({ delta }: { delta: KPIDelta }) {
  const isUp = delta.direction === 'up'
  const isDown = delta.direction === 'down'
  const sign = isUp ? '↑' : isDown ? '↓' : '→'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold',
        isUp && 'bg-green-500/15 text-green-400',
        isDown && 'bg-red-500/15 text-red-400',
        !isUp && !isDown && 'bg-slate-500/15 text-slate-400'
      )}
    >
      {sign} {Math.abs(delta.percentage).toFixed(1)}%
    </span>
  )
}
