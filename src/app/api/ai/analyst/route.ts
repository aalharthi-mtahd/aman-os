// src/app/api/ai/analyst/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { runAnalysis } from '@/lib/ai/analyst-engine'
import { WEEKLY_KPIS } from '@/lib/db/mock-data'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const current = WEEKLY_KPIS[WEEKLY_KPIS.length - 1]
  const previous = WEEKLY_KPIS[WEEKLY_KPIS.length - 2]

  const analysis = runAnalysis(current, previous)

  return NextResponse.json(analysis)
}
