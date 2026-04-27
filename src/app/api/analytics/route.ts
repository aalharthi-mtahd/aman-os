// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { gaService } from '@/services/google-analytics'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate') || '7daysAgo'
  const endDate = searchParams.get('endDate') || 'today'

  const [metrics, correlation] = await Promise.all([
    gaService.getWeeklyMetrics(startDate, endDate),
    Promise.resolve(gaService.getTrafficTransactionCorrelation()),
  ])

  const aggregated = gaService.getAggregatedMetrics(metrics)

  return NextResponse.json({
    metrics,
    aggregated,
    correlation,
    isLive: !!process.env.GOOGLE_CLIENT_EMAIL,
  })
}
