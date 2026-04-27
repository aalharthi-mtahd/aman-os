// src/lib/store/app-store.ts
import { create } from 'zustand'
import type { KPIAlert } from '@/types'

interface AppState {
  dismissedAlerts: string[]
  sidebarCollapsed: boolean
  dismissAlert: (id: string) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  dismissedAlerts: [],
  sidebarCollapsed: false,
  dismissAlert: (id) =>
    set((state) => ({ dismissedAlerts: [...state.dismissedAlerts, id] })),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
