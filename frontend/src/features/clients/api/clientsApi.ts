import { apiClient } from '@/lib/apiClient'

/** Conforme tasks/003_clientes.md, Seção 9. */
export type ClientStatus = 'ativo' | 'arquivado'

export interface Client {
  id: string
  name: string
  context: string | null
  status: ClientStatus
  archivedAt: string | null
}

export interface CreateClientPayload {
  name: string
  context?: string
}

export interface UpdateClientContextPayload {
  name?: string
  context?: string
}

/**
 * Camada única de chamadas HTTP ao domínio Clientes — mesmo padrão de
 * `authApi` (tasks/001_autenticacao.md, Seção 8), nenhuma chamada Axios
 * solta em página, conforme tasks/003_clientes.md, Seção 8/10.
 */
export const clientsApi = {
  async list(): Promise<Client[]> {
    const { data } = await apiClient.get<Client[]>('/clients')
    return data
  },

  async getById(id: string): Promise<Client> {
    const { data } = await apiClient.get<Client>(`/clients/${id}`)
    return data
  },

  async create(payload: CreateClientPayload): Promise<Client> {
    const { data } = await apiClient.post<Client>('/clients', payload)
    return data
  },

  async updateContext(
    id: string,
    payload: UpdateClientContextPayload,
  ): Promise<Client> {
    const { data } = await apiClient.patch<Client>(`/clients/${id}`, payload)
    return data
  },

  async archive(id: string): Promise<Client> {
    const { data } = await apiClient.post<Client>(`/clients/${id}/archive`)
    return data
  },
}
