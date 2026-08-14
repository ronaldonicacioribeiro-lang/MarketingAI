import { useContext } from 'react'
import { AuthContext } from '@/features/auth/context/AuthContext'

/**
 * Hook de acesso ao AuthContext, para não duplicar lógica de autenticação
 * em cada página — conforme tasks/001_autenticacao.md (Seção 8).
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.')
  }
  return context
}
