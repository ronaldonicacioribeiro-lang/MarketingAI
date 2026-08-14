import { UserMenu } from '@/components/layout/UserMenu'

/**
 * Cabeçalho com identidade do usuário/Empresa e ação de logout, conforme
 * tasks/002_dashboard.md (Seção 7.1, Seção 8).
 */
export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <span className="text-lg font-semibold text-slate-900">MarketingAI</span>
      <UserMenu />
    </header>
  )
}
