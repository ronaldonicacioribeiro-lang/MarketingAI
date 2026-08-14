import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  NON_TERMINAL_PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  projectsApi,
} from '@/features/projects/api/projectsApi'
import type { ProjectStatus } from '@/features/projects/api/projectsApi'

type LoadStatus = 'loading' | 'success' | 'error'

/**
 * Formulário de cadastro/edição de projeto — mesmo componente reutilizado
 * para as duas ações, conforme tasks/004_projetos.md, Seção 7.2.
 *
 * No cadastro (`/clients/:clientId/projects/new`), o Estado não é
 * escolhível — inicia sempre em "planejamento" (Seção 12) e nem é
 * enviado ao backend, que rejeitaria o campo (DTO não o aceita). Na
 * edição (`/projects/:id/edit`), o seletor de Estado só lista os quatro
 * valores não terminais — `concluido` só é alcançado pela ação de
 * encerramento, na tela de detalhe.
 */
export function ProjectFormPage() {
  const { clientId: clientIdParam, id } = useParams<{
    clientId?: string
    id?: string
  }>()
  const isEditing = Boolean(id)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [clientId, setClientId] = useState(clientIdParam ?? '')
  const [name, setName] = useState('')
  const [objective, setObjective] = useState('')
  const [status, setStatusValue] = useState<ProjectStatus>('planejamento')
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(
    isEditing ? 'loading' : 'success',
  )
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing || !id) {
      return
    }

    let cancelled = false

    const fetchProject = async () => {
      setLoadStatus('loading')
      try {
        const project = await projectsApi.getById(id)
        if (cancelled) return
        setClientId(project.clientId)
        setName(project.name)
        setObjective(project.objective)
        setStatusValue(project.status)
        setLoadStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setLoadError(
          extractAuthErrorMessage(error, 'Não foi possível carregar o projeto.'),
        )
        setLoadStatus('error')
      }
    }

    void fetchProject()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      if (isEditing && id) {
        await projectsApi.update(id, { name, objective, status })
        navigate(`/projects/${id}`, { replace: true })
      } else {
        const project = await projectsApi.create(clientId, { name, objective })
        navigate(`/projects/${project.id}`, { replace: true })
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout()
        return
      }
      setSubmitError(
        extractAuthErrorMessage(error, 'Não foi possível salvar o projeto.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      <h1 className="text-xl font-semibold text-slate-900">
        {isEditing ? 'Editar projeto' : 'Novo projeto'}
      </h1>

      {loadStatus === 'loading' && (
        <div className="mt-4">
          <LoadingState label="Carregando projeto..." />
        </div>
      )}

      {loadStatus === 'error' && (
        <div className="mt-4">
          <ErrorState message={loadError} />
        </div>
      )}

      {loadStatus === 'success' && (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="mt-6 max-w-md space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="objective"
              className="block text-sm font-medium text-slate-700"
            >
              Objetivo
            </label>
            <textarea
              id="objective"
              name="objective"
              required
              rows={3}
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          {isEditing ? (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-700"
              >
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(event) =>
                  setStatusValue(event.target.value as ProjectStatus)
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              >
                {NON_TERMINAL_PROJECT_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {PROJECT_STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Estado inicial: {PROJECT_STATUS_LABELS.planejamento}
            </p>
          )}

          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </AppShell>
  )
}
