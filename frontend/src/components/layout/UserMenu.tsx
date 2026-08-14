import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Menu do usuário autenticado — reaproveita a sessão/logout da Sprint 001
 * via useAuth(), sem nenhuma lógica de autenticação própria, conforme
 * tasks/002_dashboard.md (Seção 8).
 */
export function UserMenu() {
  const { user, logout } = useAuth()

  return (
    <div className="flex items-center gap-3">
      {user && (
        <span className="text-sm text-slate-600">
          {user.name}
          <span className="text-slate-400"> — {user.empresa.name}</span>
        </span>
      )}
      <button
        type="button"
        onClick={logout}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Sair
      </button>
    </div>
  )
}
