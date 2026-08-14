import axios from 'axios'
import { apiClient } from '@/lib/apiClient'
import type {
  AuthenticatedUser,
  FirstAdminPayload,
  LoginPayload,
  LoginResponse,
} from '@/features/auth/types'

/**
 * Camada única de chamadas HTTP ao domínio de autenticação/usuários —
 * nenhuma chamada Axios solta em página, conforme
 * tasks/001_autenticacao.md (Seção 8 e Seção 10).
 */
export const authApi = {
  async createFirstAdmin(payload: FirstAdminPayload): Promise<void> {
    await apiClient.post('/auth/first-admin', payload)
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/login',
      payload,
    )
    return data
  },

  async getCurrentUser(): Promise<AuthenticatedUser> {
    const { data } = await apiClient.get<AuthenticatedUser>('/users/me')
    return data
  },
}

/**
 * Extrai a mensagem de erro devolvida pela API (ex.: ConflictException,
 * UnauthorizedException ou o array de mensagens do ValidationPipe),
 * com um texto genérico como último recurso — nunca expõe detalhes
 * técnicos ao usuário.
 */
export function extractAuthErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string') {
      return message
    }
    if (Array.isArray(message) && message.length > 0) {
      return message[0]
    }
  }
  return fallback
}

/**
 * Indica se o erro corresponde a uma sessão inválida/expirada (401),
 * conforme tasks/002_dashboard.md (Seção 13): "expiração ou invalidade
 * do JWT (...) segue o tratamento já implementado na Sprint 001
 * (redirecionamento para /login)".
 */
export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401
}
