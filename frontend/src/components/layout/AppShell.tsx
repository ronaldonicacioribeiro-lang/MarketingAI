import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

/**
 * Casca de layout pós-login (sidebar + topbar + área de conteúdo),
 * reutilizável por todos os módulos futuros — conforme
 * tasks/002_dashboard.md (Seção 1, Seção 8).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
