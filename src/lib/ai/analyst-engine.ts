// src/lib/ai/analyst-engine.ts
import type { WeeklyKPI, AIAnalysis, AIAction, UserRole } from '@/types'
import { getKPIDelta } from '@/lib/db/mock-data'

interface AnalysisRule {
  metric: keyof WeeklyKPI
  threshold: number
  operator: 'lt' | 'gt' | 'lte' | 'gte'
  severity: 'critical' | 'warning'
  weight: number
}

const ANALYSIS_RULES: AnalysisRule[] = [
  { metric: 'completionRate', threshold: 70, operator: 'lt', severity: 'critical', weight: 30 },
  { metric: 'repeatRate', threshold: 25, operator: 'lt', severity: 'warning', weight: 20 },
  { metric: 'disputeRate', threshold: 4.0, operator: 'gt', severity: 'warning', weight: 15 },
  { metric: 'growthRate', threshold: 5, operator: 'lt', severity: 'warning', weight: 20 },
  { metric: 'conversionRate', threshold: 30, operator: 'lt', severity: 'warning', weight: 15 },
]

function evaluateRules(kpi: WeeklyKPI): { score: number; violations: AnalysisRule[] } {
  let deductions = 0
  const violations: AnalysisRule[] = []

  for (const rule of ANALYSIS_RULES) {
    const value = kpi[rule.metric] as number
    let triggered = false
    if (rule.operator === 'lt' && value < rule.threshold) triggered = true
    if (rule.operator === 'gt' && value > rule.threshold) triggered = true
    if (rule.operator === 'lte' && value <= rule.threshold) triggered = true
    if (rule.operator === 'gte' && value >= rule.threshold) triggered = true
    if (triggered) {
      violations.push(rule)
      deductions += rule.weight
    }
  }

  return { score: Math.max(0, 100 - deductions), violations }
}

function identifyBiggestProblem(
  kpi: WeeklyKPI,
  previous: WeeklyKPI,
  violations: AnalysisRule[]
): { en: string; ar: string } {
  if (violations.length === 0) {
    return {
      en: 'No critical thresholds breached. Monitor repeat rate for continued improvement.',
      ar: 'لا توجد عتبات حرجة تم تجاوزها. مراقبة معدل التكرار للتحسين المستمر.',
    }
  }

  const critical = violations.find((v) => v.severity === 'critical')
  const topViolation = critical || violations[0]

  const problemMessages: Record<string, { en: string; ar: string }> = {
    completionRate: {
      en: `Completion Rate at ${kpi.completionRate}% (target 70%). ${((1 - kpi.completionRate / 100) * kpi.transactions).toFixed(0)} transactions failing weekly. Destroying repeat rate and GMV ceiling.`,
      ar: `نسبة الإتمام عند ${kpi.completionRate}% (الهدف 70%). ${((1 - kpi.completionRate / 100) * kpi.transactions).toFixed(0)} عملية تفشل أسبوعياً. يدمر معدل التكرار وسقف القيمة الإجمالية.`,
    },
    repeatRate: {
      en: `Repeat Rate at ${kpi.repeatRate}% (target 25%). Retention is weak — acquired users are not returning for second transactions.`,
      ar: `معدل التكرار عند ${kpi.repeatRate}% (الهدف 25%). الاحتفاظ ضعيف — المستخدمون المكتسبون لا يعودون للعمليات الثانية.`,
    },
    disputeRate: {
      en: `Dispute Rate at ${kpi.disputeRate}% and rising. Trust signal deteriorating. Power users at risk of churn.`,
      ar: `معدل النزاعات عند ${kpi.disputeRate}% ويرتفع. إشارة الثقة تتدهور. المستخدمون النشطون في خطر التوقف.`,
    },
    growthRate: {
      en: `Growth Rate at ${kpi.growthRate}% (target 5%+). Momentum decelerating. Acquisition channels not converting efficiently.`,
      ar: `معدل النمو عند ${kpi.growthRate}% (الهدف 5%+). الزخم يتباطأ. قنوات الاستحواذ لا تحول بكفاءة.`,
    },
  }

  return problemMessages[topViolation.metric as string] || problemMessages.completionRate
}

function generateWeeklyFocus(violations: AnalysisRule[]): { en: string; ar: string } {
  if (violations.length === 0) {
    return {
      en: 'Scale what is working. Push repeat rate above 25% through targeted retention campaigns.',
      ar: 'توسيع ما يعمل. رفع معدل التكرار فوق 25% عبر حملات الاحتفاظ المستهدفة.',
    }
  }

  const critical = violations.find((v) => v.severity === 'critical')

  if (critical?.metric === 'completionRate') {
    return {
      en: 'Fix Completion Rate to 72%+. Every team. One goal. No exceptions. All other work paused.',
      ar: 'رفع نسبة الإتمام إلى 72%+. كل الفريق. هدف واحد. بلا استثناءات. كل الأعمال الأخرى متوقفة.',
    }
  }

  if (critical?.metric === 'growthRate') {
    return {
      en: 'Diagnose conversion funnel drop. Fix top-of-funnel to conversion gap immediately.',
      ar: 'تشخيص انهيار قمع التحويل. إصلاح الفجوة من أعلى القمع إلى التحويل فوراً.',
    }
  }

  return {
    en: `Resolve ${violations[0].metric} below threshold. Assign owner, set 48h deadline, daily check-in.`,
    ar: `حل ${violations[0].metric} تحت العتبة. تعيين مالك، تحديد موعد 48 ساعة، متابعة يومية.`,
  }
}

function generateKillList(
  violations: AnalysisRule[],
  kpi: WeeklyKPI
): { en: string[]; ar: string[] } {
  const allKillItems = {
    newFeatures: { en: 'New feature development', ar: 'تطوير ميزات جديدة' },
    marketing: { en: 'Marketing campaigns (non-conversion)', ar: 'حملات التسويق (غير تحويلية)' },
    bdOutreach: { en: 'BD outreach until core is fixed', ar: 'توسع المبيعات حتى إصلاح الأساس' },
    partnerships: { en: 'Partnership announcements', ar: 'إعلانات الشراكات' },
    roadmap: { en: 'Roadmap planning sessions', ar: 'جلسات التخطيط للخارطة' },
    hiring: { en: 'Non-critical hiring', ar: 'التوظيف غير الضروري' },
  }

  const hasCritical = violations.some((v) => v.severity === 'critical')
  const hasGrowthIssue = kpi.growthRate < 5

  if (hasCritical) {
    return {
      en: [allKillItems.newFeatures.en, allKillItems.marketing.en, allKillItems.bdOutreach.en],
      ar: [allKillItems.newFeatures.ar, allKillItems.marketing.ar, allKillItems.bdOutreach.ar],
    }
  }

  if (hasGrowthIssue) {
    return {
      en: [allKillItems.partnerships.en, allKillItems.roadmap.en, allKillItems.hiring.en],
      ar: [allKillItems.partnerships.ar, allKillItems.roadmap.ar, allKillItems.hiring.ar],
    }
  }

  return {
    en: [allKillItems.roadmap.en, allKillItems.hiring.en],
    ar: [allKillItems.roadmap.ar, allKillItems.hiring.ar],
  }
}

function generateActions(
  violations: AnalysisRule[],
  kpi: WeeklyKPI
): AIAction[] {
  const actionTemplates: Record<string, AIAction[]> = {
    completionRate: [
      {
        id: 'act-001',
        priority: 1,
        text: 'Audit last 500 failed transactions — categorize failure reasons (gateway/UX/fraud)',
        textAr: 'تدقيق آخر 500 عملية فاشلة — تصنيف أسباب الفشل (بوابة/تجربة مستخدم/احتيال)',
        owner: 'CTO',
      },
      {
        id: 'act-002',
        priority: 2,
        text: 'Add real-time transaction failure alerts with 15-minute escalation to CTO',
        textAr: 'إضافة تنبيهات فورية لفشل العمليات مع تصعيد كل 15 دقيقة إلى المدير التقني',
        owner: 'CTO',
      },
      {
        id: 'act-003',
        priority: 3,
        text: 'Daily completion rate dashboard on CEO screen — 9AM standup metric #1',
        textAr: 'لوحة نسبة الإتمام اليومية على شاشة الرئيس التنفيذي — مؤشر رقم 1 في الاجتماع الصباحي',
        owner: 'CEO',
      },
    ],
    repeatRate: [
      {
        id: 'act-004',
        priority: 1,
        text: 'Launch re-engagement SMS to users with 1 completed transaction in last 30 days',
        textAr: 'إطلاق SMS لإعادة التفاعل للمستخدمين بعملية مكتملة واحدة في آخر 30 يوماً',
        owner: 'COO',
      },
      {
        id: 'act-005',
        priority: 2,
        text: 'Identify top 20% repeat users — interview 5 this week for retention drivers',
        textAr: 'تحديد أعلى 20% من المستخدمين المتكررين — مقابلة 5 منهم هذا الأسبوع',
        owner: 'BD',
      },
      {
        id: 'act-006',
        priority: 3,
        text: 'Add post-transaction NPS survey — identify satisfaction gaps',
        textAr: 'إضافة استطلاع NPS بعد العملية — تحديد ثغرات الرضا',
        owner: 'COO',
      },
    ],
    growthRate: [
      {
        id: 'act-007',
        priority: 1,
        text: 'Audit conversion funnel — identify biggest drop-off step with GA data',
        textAr: 'تدقيق قمع التحويل — تحديد أكبر نقطة تسرب بيانات تحليلات Google',
        owner: 'CTO',
      },
      {
        id: 'act-008',
        priority: 2,
        text: 'A/B test new landing page headline focusing on trust over features',
        textAr: 'اختبار A/B لعنوان صفحة الهبوط الجديدة مع التركيز على الثقة لا المميزات',
        owner: 'BD',
      },
      {
        id: 'act-009',
        priority: 3,
        text: 'Activate 3 dormant enterprise BD prospects this week — direct CEO outreach',
        textAr: 'تفعيل 3 عملاء مؤسسيين غير نشطين هذا الأسبوع — تواصل مباشر من الرئيس التنفيذي',
        owner: 'CEO',
      },
    ],
  }

  if (violations.length === 0) {
    return actionTemplates.repeatRate
  }

  const topViolation = violations.find((v) => v.severity === 'critical') || violations[0]
  return actionTemplates[topViolation.metric as string] || actionTemplates.completionRate
}

function generateSnapshot(
  kpi: WeeklyKPI,
  previous: WeeklyKPI,
  score: number
): { en: string; ar: string } {
  const txDelta = getKPIDelta(kpi.transactions, previous.transactions)
  const direction = txDelta.direction === 'up' ? 'up' : 'down'

  if (kpi.completionRate < 70) {
    return {
      en: `Growth is real but fragile. Transactions ${direction === 'up' ? 'up' : 'down'} ${Math.abs(txDelta.percentage).toFixed(1)}%, but Completion Rate at ${kpi.completionRate}% threatens everything. Fix completions first — everything else is noise.`,
      ar: `النمو حقيقي لكن هش. العمليات ${direction === 'up' ? 'ارتفعت' : 'انخفضت'} ${Math.abs(txDelta.percentage).toFixed(1)}%، لكن نسبة الإتمام عند ${kpi.completionRate}% تهدد كل شيء. الإصلاح أولاً — كل شيء آخر ضجيج.`,
    }
  }

  if (score > 80) {
    return {
      en: `Strong week. Transactions up ${txDelta.percentage.toFixed(1)}%, all KPIs above threshold. Now scale what's working — push repeat rate past 27%.`,
      ar: `أسبوع قوي. العمليات ارتفعت ${txDelta.percentage.toFixed(1)}%، جميع المؤشرات فوق الحد الأدنى. الآن وسّع ما يعمل — ادفع معدل التكرار فوق 27%.`,
    }
  }

  return {
    en: `Mixed signals. Growth at ${kpi.growthRate.toFixed(1)}% but quality metrics under pressure. Don't mistake volume for health.`,
    ar: `إشارات مختلطة. النمو عند ${kpi.growthRate.toFixed(1)}% لكن مؤشرات الجودة تحت الضغط. لا تخلط بين الحجم والصحة.`,
  }
}

export function runAnalysis(current: WeeklyKPI, previous: WeeklyKPI): AIAnalysis {
  const { score, violations } = evaluateRules(current)
  const snapshot = generateSnapshot(current, previous, score)
  const biggestProblem = identifyBiggestProblem(current, previous, violations)
  const weeklyFocus = generateWeeklyFocus(violations)
  const killList = generateKillList(violations, current)
  const actions = generateActions(violations, current)

  return {
    snapshot: snapshot.en,
    snapshotAr: snapshot.ar,
    biggestProblem: biggestProblem.en,
    biggestProblemAr: biggestProblem.ar,
    weeklyFocus: weeklyFocus.en,
    weeklyFocusAr: weeklyFocus.ar,
    killList: killList.en,
    killListAr: killList.ar,
    actions,
    healthScore: score,
    generatedAt: new Date(),
  }
}
