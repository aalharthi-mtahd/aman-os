// src/app/api/kpi/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { WEEKLY_KPIS, KPI_ALERTS, getLastNWeeks, getKPIDelta } from '@/lib/db/mock-data'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const weeks = parseInt(searchParams.get('weeks') || '12')

  const historicalData = getLastNWeeks(weeks)
  const current = historicalData[historicalData.length - 1]
  const previous = historicalData[historicalData.length - 2]

  const deltas = previous
    ? {
        transactions: getKPIDelta(current.transactions, previous.transactions),
        gmv: getKPIDelta(current.gmv, previous.gmv),
        revenue: getKPIDelta(current.revenue, previous.revenue),
        completionRate: getKPIDelta(current.completionRate, previous.completionRate),
        wau: getKPIDelta(current.wau, previous.wau),
        repeatRate: getKPIDelta(current.repeatRate, previous.repeatRate),
        disputeRate: getKPIDelta(current.disputeRate, previous.disputeRate),
        conversionRate: getKPIDelta(current.conversionRate, previous.conversionRate),
        growthRate: getKPIDelta(current.growthRate, previous.growthRate),
      }
    : null

  return NextResponse.json({
    current,
    previous,
    historical: historicalData,
    deltas,
    alerts: KPI_ALERTS.filter((a) => !a.resolved),
    generatedAt: new Date().toISOString(),
  })
}
