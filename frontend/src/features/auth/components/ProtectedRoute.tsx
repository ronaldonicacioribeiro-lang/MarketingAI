import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Componente de proteção de rota, genérico e reutilizável por qualquer
 * módulo futuro (Dashboard e além) — conforme tasks/001_autenticacao.md
 * (Seção 8) e tasks/002_dashboard.md (Seções 6 e 13).
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
