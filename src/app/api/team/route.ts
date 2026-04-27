// src/app/api/team/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { TEAM_MEMBERS } from '@/lib/db/mock-data'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const summary = {
    totalMembers: TEAM_MEMBERS.length,
    onTrack: TEAM_MEMBERS.filter((m) => m.status === 'GREEN').length,
    atRisk: TEAM_MEMBERS.filter((m) => m.status === 'RED').length,
    inProgress: TEAM_MEMBERS.filter((m) => m.status === 'YELLOW').length,
    avgPerformance:
      Math.round(
        TEAM_MEMBERS.reduce((sum, m) => sum + m.currentPerformance, 0) / TEAM_MEMBERS.length
      ),
    criticalPath: 'CTO — Completion fix deployment blocking all quality KPIs',
    criticalPathAr: 'المدير التقني — نشر إصلاح الإتمام يحجب جميع مؤشرات الجودة',
  }

  return NextResponse.json({
    members: TEAM_MEMBERS,
    summary,
  })
}
