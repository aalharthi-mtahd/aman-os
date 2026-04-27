// src/app/api/ai/forecast/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { generateForecast, generateForecastTimeSeries } from '@/lib/ai/forecast-engine'
import { WEEKLY_KPIS } from '@/lib/db/mock-data'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const includeTimeSeries = searchParams.get('timeSeries') === 'true'

  try {
    const forecast = generateForecast(WEEKLY_KPIS)
    const response: Record<string, unknown> = { forecast }

    if (includeTimeSeries) {
      response.timeSeries = generateForecastTimeSeries(WEEKLY_KPIS, 4)
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Insufficient data for forecast' },
      { status: 422 }
    )
  }
}
