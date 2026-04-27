'use client'
import { Topbar } from '@/components/layout/topbar'
import { useTeamData } from '@/hooks/use-kpi-data'
import { useTranslations, useLocale } from 'next-intl'
import { cn, getStatusColor, getStatusBg } from '@/lib/utils'
import type { TeamMember } from '@/types'

export default function TeamPage() {
  const t = useTranslations('team')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const { data, isLoading } = useTeamData()

  const members = data?.members || []
  const summary = data?.summary

  return (
    <div>
      <Topbar pageKey="team" />
      <div className="p-6">
        {/* Summary row */}
        {summary && (
          <div className="mb-5 grid grid-cols-4 gap-4 animate-fade-in-up">
            <SumCard
              label={isAr ? 'على المسار' : 'On Track'}
              value={summary.onTrack}
              total={summary.totalMembers}
              color="green"
            />
            <SumCard
              label={isAr ? 'قيد التنفيذ' : 'In Progress'}
              value={summary.inProgress}
              total={summary.totalMembers}
              color="yellow"
            />
            <SumCard
              label={isAr ? 'في خطر' : 'At Risk'}
              value={summary.atRisk}
              total={summary.totalMembers}
              color="red"
            />
            <div className="rounded-2xl border border-brand-border bg-brand-card p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('team_health')}
              </div>
              <div className="font-mono text-2xl font-black text-white">
                {summary.avgPerformance}%
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {isAr ? 'متوسط أداء الفريق' : 'Average team performance'}
              </div>
            </div>
          </div>
        )}

        {/* Critical Path */}
        {summary && (
          <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-950/10 p-4 animate-fade-in-up">
            <span className="mr-2 text-xs font-bold text-red-400 uppercase tracking-wider">
              {t('ai_priority')}:
            </span>
            <span className="text-sm text-slate-200">
              {isAr ? summary.criticalPathAr : summary.criticalPath}
            </span>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-brand-card" />
            ))}
          </div>
        )}

        {members.length > 0 && (
          <div className="space-y-3 animate-fade-in-up">
            {members.map((member) => (
              <MemberRow key={member.id} member={member} isAr={isAr} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SumCard({
  label, value, total, color,
}: {
  label: string
  value: number
  total: number
  color: 'green' | 'yellow' | 'red'
}) {
  const colorMap = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  }
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={cn('font-mono text-3xl font-black', colorMap[color])}>
        {value}
        <span className="text-base text-slate-600">/{total}</span>
      </div>
    </div>
  )
}

function MemberRow({ member, isAr, t }: { member: TeamMember; isAr: boolean; t: ReturnType<typeof useTranslations> }) {
  const statusLabel = {
    GREEN: t('green'),
    YELLOW: t('yellow'),
    RED: t('red'),
  }
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-700 text-sm font-bold text-white">
            {(isAr ? member.nameAr : member.name).charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white">
              {isAr ? member.nameAr : member.name}
            </div>
            <div className="text-xs font-bold text-brand-emerald">{member.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-xl font-black text-white">
              {member.currentPerformance}%
            </div>
            <div className="text-xs text-slate-500">{isAr ? 'أداء الأسبوع' : 'Week performance'}</div>
          </div>
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-bold',
              getStatusBg(member.status),
              getStatusColor(member.status)
            )}
          >
            {statusLabel[member.status]}
          </span>
        </div>
      </div>

      {/* Target rows */}
      <div className="space-y-2.5">
        {member.weeklyTargets.map((target, i) => (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">{target.metric}</span>
              <span className="font-mono text-slate-300">
                {target.actual.toLocaleString()} / {target.target.toLocaleString()} {target.unit}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={cn(
                  'progress-fill',
                  target.progress >= 90
                    ? 'bg-green-500'
                    : target.progress >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                )}
                style={{ width: `${Math.min(100, target.progress)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
