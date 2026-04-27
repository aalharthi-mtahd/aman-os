// src/app/api/experiments/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { EXPERIMENTS } from '@/lib/db/mock-data'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const summary = {
    total: EXPERIMENTS.length,
    running: EXPERIMENTS.filter((e) => e.status === 'RUNNING').length,
    keep: EXPERIMENTS.filter((e) => e.verdict === 'KEEP').length,
    kill: EXPERIMENTS.filter((e) => e.verdict === 'KILL').length,
    review: EXPERIMENTS.filter((e) => e.verdict === 'REVIEW').length,
    avgHitRate: (() => {
      const completed = EXPERIMENTS.filter((e) => e.kpiImpactActual !== undefined)
      if (completed.length === 0) return 0
      const total = completed.reduce((sum, e) => {
        return sum + (e.kpiImpactActual! / e.kpiImpactExpected) * 100
      }, 0)
      return Math.round(total / completed.length)
    })(),
  }

  return NextResponse.json({ experiments: EXPERIMENTS, summary })
}
