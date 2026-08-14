import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PROJECT_STATUS_LABELS, projectsApi } from '@/features/projects/api/projectsApi'
import type { Project } from '@/features/projects/api/projectsApi'

type Status = 'loading' | 'success' | 'error'

interface ClientProjectsSectionProps {
  clientId: string
}

/**
 * Seção "Projetos" embutida no detalhe do Cliente — conforme
 * tasks/004_projetos.md, Seção 7.1/14. Substitui o EmptyState estático
 * da Sprint 003 por dado real; todos os projetos do Cliente são
 * exibidos, em qualquer Estado (Seção 8 da task).
 */
export function ClientProjectsSection({ clientId }: ClientProjectsSectionProps) {
  const { logout } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchProjects = async () => {
      setStatus('loading')
      try {
        const data = await projectsApi.listByClient(clientId)
        if (cancelled) return
        setProjects(data)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setErrorMessage(
          extractAuthErrorMessage(error, 'Não foi possível carregar os projetos.'),
        )
        setStatus('error')
      }
    }

    void fetchProjects()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, attempt])

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-600">Projetos</h2>
        <Link
          to={`/clients/${clientId}/projects/new`}
          className="text-xs font-medium text-slate-700 underline"
        >
          + Novo projeto
        </Link>
      </div>

      <div className="mt-2">
        {status === 'loading' && <LoadingState label="Carregando projetos..." />}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => setAttempt((n) => n + 1)} />
        )}

        {status === 'success' && projects.length === 0 && (
          <EmptyState message="Nenhum projeto ainda." />
        )}

        {status === 'success' && projects.length > 0 && (
          <ul className="mt-1 divide-y divide-slate-100">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between py-2 text-sm hover:text-slate-900"
                >
                  <span className="font-medium text-slate-800">{project.name}</span>
                  <span className="text-xs text-slate-500">
                    {PROJECT_STATUS_LABELS[project.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
