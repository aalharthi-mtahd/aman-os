// src/lib/auth/permissions.ts
import type { UserRole } from '@/types'

export type Permission =
  | 'view:dashboard'
  | 'view:ai_analyst'
  | 'view:forecast'
  | 'view:sales_coach'
  | 'view:team'
  | 'view:experiments'
  | 'view:weekly_os'
  | 'view:analytics'
  | 'edit:kpi'
  | 'edit:team'
  | 'edit:experiments'
  | 'edit:decisions'
  | 'admin:users'
  | 'admin:settings'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CEO: [
    'view:dashboard',
    'view:ai_analyst',
    'view:forecast',
    'view:sales_coach',
    'view:team',
    'view:experiments',
    'view:weekly_os',
    'view:analytics',
    'edit:kpi',
    'edit:team',
    'edit:experiments',
    'edit:decisions',
  ],
  CTO: [
    'view:dashboard',
    'view:ai_analyst',
    'view:forecast',
    'view:team',
    'view:experiments',
    'view:weekly_os',
    'view:analytics',
    'edit:experiments',
  ],
  COO: [
    'view:dashboard',
    'view:ai_analyst',
    'view:forecast',
    'view:sales_coach',
    'view:team',
    'view:experiments',
    'view:weekly_os',
    'view:analytics',
    'edit:team',
    'edit:experiments',
    'edit:decisions',
  ],
  BD: [
    'view:dashboard',
    'view:sales_coach',
    'view:weekly_os',
    'view:analytics',
  ],
  ADMIN: [
    'view:dashboard',
    'view:ai_analyst',
    'view:forecast',
    'view:sales_coach',
    'view:team',
    'view:experiments',
    'view:weekly_os',
    'view:analytics',
    'edit:kpi',
    'edit:team',
    'edit:experiments',
    'edit:decisions',
    'admin:users',
    'admin:settings',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const routePermissions: Record<string, Permission> = {
    '/dashboard': 'view:dashboard',
    '/dashboard/ai': 'view:ai_analyst',
    '/dashboard/forecast': 'view:forecast',
    '/dashboard/coach': 'view:sales_coach',
    '/dashboard/team': 'view:team',
    '/dashboard/experiments': 'view:experiments',
    '/dashboard/week': 'view:weekly_os',
    '/dashboard/analytics': 'view:analytics',
  }
  const required = routePermissions[route]
  if (!required) return true
  return hasPermission(role, required)
}
