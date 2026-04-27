'use client'
// src/components/ui/alert-banner.tsx
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import type { KPIAlert } from '@/types'

interface AlertBannerProps {
  alerts: KPIAlert[]
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const locale = useLocale()
  const isAr = locale === 'ar'

  const visible = alerts.filter((a) => !dismissed.includes(a.id))
  if (visible.length === 0) return null

  return (
    <div className="mb-5 space-y-2">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            'flex items-center justify-between gap-3 rounded-xl border px-4 py-3',
            alert.type === 'CRITICAL' &&
              'border-red-500/30 bg-red-500/10 text-red-400',
            alert.type === 'WARNING' &&
              'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
            alert.type === 'INFO' &&
              'border-blue-500/30 bg-blue-500/10 text-blue-400'
          )}
        >
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-base">
              {alert.type === 'CRITICAL' ? '⚠' : alert.type === 'WARNING' ? '⚡' : 'ℹ'}
            </span>
            <span className="font-semibold">
              {isAr ? alert.messageAr : alert.message}
            </span>
          </div>
          <button
            onClick={() => setDismissed((prev) => [...prev, alert.id])}
            className="flex-shrink-0 rounded p-1 opacity-60 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
