import axios from 'axios'

/**
 * Instância única do Axios, reutilizável por todos os módulos futuros,
 * conforme tasks/001_autenticacao.md (Seção 8).
 *
 * Também concentra a persistência do token de sessão (localStorage) e
 * o anexo automático do JWT a toda requisição — Seções 3, 10 e 13 da task.
 */

const TOKEN_STORAGE_KEY = 'marketingai.auth.token'

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})
