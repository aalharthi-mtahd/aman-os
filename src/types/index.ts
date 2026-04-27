// src/types/index.ts

export type UserRole = 'CEO' | 'CTO' | 'COO' | 'BD' | 'ADMIN'

export type Locale = 'en' | 'ar'

export interface User {
  id: string
  name: string
  nameAr: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface AuthSession {
  user: User
  expires: string
}

// KPI Types
export interface WeeklyKPI {
  weekId: string
  weekStart: Date
  weekEnd: Date
  transactions: number
  gmv: number
  revenue: number
  wau: number
  repeatRate: number
  takeRate: number
  completionRate: number
  disputeRate: number
  timeToTransaction: number
  conversionRate: number
  growthRate: number
  previousWeek?: WeeklyKPI
}

export interface KPIAlert {
  id: string
  type: 'CRITICAL' | 'WARNING' | 'INFO'
  metric: string
  message: string
  messageAr: string
  threshold: number
  currentValue: number
  triggeredAt: Date
  resolved: boolean
}

export interface KPIDelta {
  value: number
  percentage: number
  direction: 'up' | 'down' | 'stable'
}

// AI Types
export interface AIAnalysis {
  snapshot: string
  snapshotAr: string
  biggestProblem: string
  biggestProblemAr: string
  weeklyFocus: string
  weeklyFocusAr: string
  killList: string[]
  killListAr: string[]
  actions: AIAction[]
  healthScore: number
  generatedAt: Date
}

export interface AIAction {
  id: string
  priority: 1 | 2 | 3
  text: string
  textAr: string
  owner: UserRole
  dueDate?: Date
}

export interface GrowthForecast {
  weekStart: Date
  scenarioBest: ForecastScenario
  scenarioExpected: ForecastScenario
  scenarioWorst: ForecastScenario
  drivers: string[]
  driversAr: string[]
  bottlenecks: string[]
  bottlenecksAr: string[]
  keyAction: string
  keyActionAr: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  confidence: number
  rationale: string
  rationaleAr: string
  generatedAt: Date
}

export interface ForecastScenario {
  transactions: number
  growthRate: number
  gmv: number
  revenue: number
  conditions: string[]
  conditionsAr: string[]
}

export interface SalesCoachInput {
  conversation: string
  language: Locale
  context?: string
}

export interface SalesCoachOutput {
  whatWentWrong: string
  betterScript: string
  closingStrategy: string
  nextStep: string
  language: Locale
}

// Team Types
export interface TeamMember {
  id: string
  userId: string
  name: string
  nameAr: string
  role: UserRole
  weeklyTargets: KPITarget[]
  currentPerformance: number
  status: 'GREEN' | 'YELLOW' | 'RED'
}

export interface KPITarget {
  metric: string
  target: number
  actual: number
  unit: string
  progress: number
}

// Experiment Types
export interface Experiment {
  id: string
  hypothesis: string
  hypothesisAr: string
  kpiTarget: string
  kpiImpactExpected: number
  kpiImpactActual?: number
  status: 'RUNNING' | 'COMPLETE' | 'KILLED'
  verdict?: 'KEEP' | 'KILL' | 'REVIEW'
  startDate: Date
  endDate?: Date
  ownerId: string
}

// Weekly OS Types
export interface WeeklyPlan {
  id: string
  weekStart: Date
  kpiReview: KPIReviewItem[]
  problems: Problem[]
  focusOfWeek: string
  focusOfWeekAr: string
  killList: string[]
  killListAr: string[]
  decisions: Decision[]
  generatedAt: Date
}

export interface KPIReviewItem {
  metric: string
  target: number
  actual: number
  status: 'GREEN' | 'YELLOW' | 'RED'
  note: string
  noteAr: string
}

export interface Problem {
  id: string
  priority: 'P1' | 'P2' | 'P3'
  description: string
  descriptionAr: string
  owner?: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
}

export interface Decision {
  id: string
  description: string
  descriptionAr: string
  decidedBy: string
  decidedAt: Date
  status: 'DONE' | 'PENDING'
}

// Analytics Types
export interface GAMetrics {
  sessions: number
  users: number
  pageviews: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  date: string
}

export interface TrafficTransactionCorrelation {
  date: string
  sessions: number
  transactions: number
  conversionRate: number
}

// Chart Data Types
export interface ChartDataPoint {
  label: string
  value: number
  date?: string
}

export interface TimeSeriesData {
  labels: string[]
  datasets: {
    id: string
    label: string
    data: number[]
    color: string
  }[]
}
