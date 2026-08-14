import { createContext, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '@/features/auth/api/authApi'
import type { AuthenticatedUser } from '@/features/auth/types'
import { getStoredAuthToken, setStoredAuthToken } from '@/lib/apiClient'

/**
 * Contexto responsável por usuário atual, estado de autenticação, login,
 * logout e restauração de sessão — conforme tasks/001_autenticacao.md
 * (Seção 8, Seção 11). Nenhuma outra página duplica esta lógica.
 */
interface AuthContextValue {
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  // Começa "carregando" para que a restauração de sessão (Seção 6.3) seja
  // concluída antes de ProtectedRoute decidir redirecionar para /login.
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredAuthToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await authApi.getCurrentUser()
        setUser(currentUser)
      } catch {
        // Token ausente, inválido ou expirado — Seção 6.3: usuário
        // permanece não autenticado, sessão local é descartada.
        setStoredAuthToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void restoreSession()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await authApi.login({ email, password })
    setStoredAuthToken(accessToken)
    const currentUser = await authApi.getCurrentUser()
    setUser(currentUser)
  }, [])

  const logout = useCallback(() => {
    setStoredAuthToken(null)
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
