// src/app/api/ai/coach/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { analyzeConversation, generateSimulationOpener } from '@/lib/ai/coach-engine'
import { z } from 'zod'

const AnalyzeSchema = z.object({
  conversation: z.string().min(10).max(5000),
  language: z.enum(['en', 'ar']),
  context: z.string().optional(),
})

const SimulationSchema = z.object({
  language: z.enum(['en', 'ar']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') || 'analyze'

  if (mode === 'simulate') {
    const parsed = SimulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const opener = generateSimulationOpener(
      parsed.data.language,
      parsed.data.difficulty || 'medium'
    )
    return NextResponse.json({ opener })
  }

  const parsed = AnalyzeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  // Small artificial delay to simulate AI processing
  await new Promise((r) => setTimeout(r, 500))

  const result = analyzeConversation(parsed.data)
  return NextResponse.json(result)
}
