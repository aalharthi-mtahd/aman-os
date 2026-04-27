// src/lib/utils/index.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (compact && value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-SA').format(Math.round(value))
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `﹤${(value / 1_000_000).toFixed(2)}M`
  }
  if (compact && value >= 1_000) {
    return `﹤${(value / 1_000).toFixed(1)}K`
  }
  return `﹤${new Intl.NumberFormat('en-SA').format(Math.round(value))}`
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDelta(delta: { percentage: number; direction: string }): string {
  const sign = delta.direction === 'up' ? '+' : delta.direction === 'down' ? '' : ''
  return `${sign}${delta.percentage.toFixed(1)}%`
}

export function getStatusColor(status: 'GREEN' | 'YELLOW' | 'RED'): string {
  switch (status) {
    case 'GREEN':
      return 'text-status-success'
    case 'YELLOW':
      return 'text-status-warning'
    case 'RED':
      return 'text-status-danger'
  }
}

export function getStatusBg(status: 'GREEN' | 'YELLOW' | 'RED'): string {
  switch (status) {
    case 'GREEN':
      return 'bg-green-500/10 border-green-500/20'
    case 'YELLOW':
      return 'bg-yellow-500/10 border-yellow-500/20'
    case 'RED':
      return 'bg-red-500/10 border-red-500/20'
  }
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export function getWeekLabel(weekId: string): string {
  return `W${weekId.split('-')[1]}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
