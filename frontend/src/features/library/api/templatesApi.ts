import { apiClient } from '@/lib/apiClient'

/** Conforme tasks/005_templates.md, Seção 9/13. */
export type TemplateStatus = 'ativo' | 'arquivado'

export interface Template {
  id: string
  name: string
  description: string | null
  content: string | null
  status: TemplateStatus
}

export interface CreateTemplatePayload {
  name: string
  description?: string
  content?: string
}

export interface UpdateTemplatePayload {
  name?: string
  description?: string
  content?: string
}

/**
 * Camada única de chamadas HTTP ao domínio Biblioteca (Template) — mesmo
 * padrão de `clientsApi`/`projectsApi` (tasks/003_clientes.md,
 * tasks/004_projetos.md), conforme tasks/005_templates.md, Seção 8/10.
 */
export const templatesApi = {
  async list(): Promise<Template[]> {
    const { data } = await apiClient.get<Template[]>('/templates')
    return data
  },

  async getById(id: string): Promise<Template> {
    const { data } = await apiClient.get<Template>(`/templates/${id}`)
    return data
  },

  async create(payload: CreateTemplatePayload): Promise<Template> {
    const { data } = await apiClient.post<Template>('/templates', payload)
    return data
  },

  async update(id: string, payload: UpdateTemplatePayload): Promise<Template> {
    const { data } = await apiClient.patch<Template>(`/templates/${id}`, payload)
    return data
  },

  async archive(id: string): Promise<Template> {
    const { data } = await apiClient.post<Template>(`/templates/${id}/archive`)
    return data
  },
}
