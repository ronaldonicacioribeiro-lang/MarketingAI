import { apiClient } from '@/lib/apiClient'

/** Conforme tasks/004_projetos.md, Seção 8/12. */
export type ProjectStatus =
  | 'planejamento'
  | 'em_execucao'
  | 'aguardando_aprovacao'
  | 'pausado'
  | 'concluido'

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planejamento: 'Planejamento',
  em_execucao: 'Em execução',
  aguardando_aprovacao: 'Aguardando aprovação',
  pausado: 'Pausado',
  concluido: 'Concluído',
}

/** Transição livre entre estes quatro — `concluido` só via `close()`. */
export const NON_TERMINAL_PROJECT_STATUSES: ProjectStatus[] = [
  'planejamento',
  'em_execucao',
  'aguardando_aprovacao',
  'pausado',
]

export interface Project {
  id: string
  clientId: string
  name: string
  objective: string
  status: ProjectStatus
}

export type ProjectHistoryEventType = 'criado' | 'estado_alterado'

export interface ProjectHistoryEvent {
  id: string
  type: ProjectHistoryEventType
  fromStatus: ProjectStatus | null
  toStatus: ProjectStatus
  occurredAt: string
}

export interface CreateProjectPayload {
  name: string
  objective: string
}

export interface UpdateProjectPayload {
  name?: string
  objective?: string
  status?: ProjectStatus
}

/**
 * Camada única de chamadas HTTP ao domínio Projetos — mesmo padrão de
 * `clientsApi` (tasks/003_clientes.md, Seção 8), conforme
 * tasks/004_projetos.md, Seção 9/10.
 */
export const projectsApi = {
  async listByClient(clientId: string): Promise<Project[]> {
    const { data } = await apiClient.get<Project[]>(
      `/clients/${clientId}/projects`,
    )
    return data
  },

  async getById(id: string): Promise<Project> {
    const { data } = await apiClient.get<Project>(`/projects/${id}`)
    return data
  },

  async create(
    clientId: string,
    payload: CreateProjectPayload,
  ): Promise<Project> {
    const { data } = await apiClient.post<Project>(
      `/clients/${clientId}/projects`,
      payload,
    )
    return data
  },

  async update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const { data } = await apiClient.patch<Project>(
      `/projects/${id}`,
      payload,
    )
    return data
  },

  async close(id: string): Promise<Project> {
    const { data } = await apiClient.post<Project>(`/projects/${id}/close`)
    return data
  },

  async getHistory(id: string): Promise<ProjectHistoryEvent[]> {
    const { data } = await apiClient.get<ProjectHistoryEvent[]>(
      `/projects/${id}/history`,
    )
    return data
  },
}
