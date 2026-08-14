import { useEffect, useState } from 'react'
import { authApi, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { AuthenticatedUser } from '@/features/auth/types'

type Status = 'loading' | 'success' | 'error'

/**
 * Busca os dados do usuário/Empresa autenticados especificamente para o
 * Dashboard, com seus próprios estados de carregamento/erro/nova
 * tentativa — conforme tasks/002_dashboard.md (Seção 6, Seção 15).
 *
 * Reaproveita authApi.getCurrentUser() (mesmo endpoint GET /users/me da
 * Sprint 001, nenhuma rota nova) e, em caso de sessão inválida/expirada,
 * reaproveita o logout() do AuthContext em vez de criar um novo
 * comportamento de expiração (tasks/002_dashboard.md, Seção 13) — mesmo
 * padrão de efeito de busca já usado em restoreSession()
 * (tasks/001_autenticacao.md, AuthContext).
 */
export function useDashboardUser() {
  const { logout } = useAuth()
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchUser = async () => {
      setStatus('loading')
      try {
        const currentUser = await authApi.getCurrentUser()
        if (cancelled) return
        setUser(currentUser)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setStatus('error')
      }
    }

    void fetchUser()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  const retry = () => setAttempt((previous) => previous + 1)

  return { user, status, retry }
}
