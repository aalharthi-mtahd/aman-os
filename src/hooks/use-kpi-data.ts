// src/hooks/use-kpi-data.ts
import useSWR from 'swr'
import type { WeeklyKPI, KPIAlert, AIAnalysis, GrowthForecast, TeamMember } from '@/types'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export function useKPIData(weeks = 12) {
  return useSWR<{
    current: WeeklyKPI
    previous: WeeklyKPI
    historical: WeeklyKPI[]
    deltas: Record<string, { value: number; percentage: number; direction: string }>
    alerts: KPIAlert[]
  }>(`/api/kpi?weeks=${weeks}`, fetcher, {
    refreshInterval: 30_000, // Refresh every 30s
    revalidateOnFocus: true,
  })
}

export function useAIAnalysis() {
  return useSWR<AIAnalysis>('/api/ai/analyst', fetcher, {
    refreshInterval: 60_000 * 5, // Refresh every 5 min
  })
}

export function useForecast(includeTimeSeries = false) {
  return useSWR<{
    forecast: GrowthForecast
    timeSeries?: {
      labels: string[]
      actual: (number | null)[]
      best: (number | null)[]
      expected: (number | null)[]
      worst: (number | null)[]
    }
  }>(`/api/ai/forecast?timeSeries=${includeTimeSeries}`, fetcher, {
    refreshInterval: 60_000 * 10,
  })
}

export function useTeamData() {
  return useSWR<{
    members: TeamMember[]
    summary: {
      totalMembers: number
      onTrack: number
      atRisk: number
      inProgress: number
      avgPerformance: number
      criticalPath: string
      criticalPathAr: string
    }
  }>('/api/team', fetcher, {
    refreshInterval: 60_000 * 2,
  })
}

export function useAnalytics() {
  return useSWR<{
    metrics: { date: string; sessions: number; users: number; bounceRate: number; conversionRate: number; avgSessionDuration: number }[]
    aggregated: { sessions: number; users: number; bounceRate: number; avgSessionDuration: number; conversionRate: number } | null
    correlation: { date: string; sessions: number; transactions: number; conversionRate: number }[]
    isLive: boolean
  }>('/api/analytics', fetcher, {
    refreshInterval: 60_000 * 15,
  })
}
