import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PROJECT_STATUS_LABELS, projectsApi } from '@/features/projects/api/projectsApi'
import type { Project, ProjectHistoryEvent } from '@/features/projects/api/projectsApi'

type Status = 'loading' | 'success' | 'error'

/**
 * Detalhe do projeto — nome, Objetivo, Estado e histórico reais, e
 * seções em estado vazio explícito para Landing Pages/Campanhas/
 * Relatórios/Insights, conforme tasks/004_projetos.md, Seção 7.3.
 * Nenhum dado desses módulos futuros é referenciado como se existisse.
 */
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()

  const [project, setProject] = useState<Project | null>(null)
  const [history, setHistory] = useState<ProjectHistoryEvent[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [closeError, setCloseError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchProject = async () => {
      setStatus('loading')
      try {
        const [projectData, historyData] = await Promise.all([
          projectsApi.getById(id),
          projectsApi.getHistory(id),
        ])
        if (cancelled) return
        setProject(projectData)
        setHistory(historyData)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setErrorMessage(
          extractAuthErrorMessage(error, 'Não foi possível carregar o projeto.'),
        )
        setStatus('error')
      }
    }

    void fetchProject()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, attempt])

  const handleClose = async () => {
    if (!id) return
    setIsClosing(true)
    setCloseError(null)
    try {
      const closed = await projectsApi.close(id)
      const historyData = await projectsApi.getHistory(id)
      setProject(closed)
      setHistory(historyData)
      setIsConfirmOpen(false)
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout()
        return
      }
      setCloseError(
        extractAuthErrorMessage(error, 'Não foi possível encerrar o projeto.'),
      )
      setIsConfirmOpen(false)
    } finally {
      setIsClosing(false)
    }
  }

  const isClosed = project?.status === 'concluido'

  return (
    <AppShell>
      {status === 'loading' && <LoadingState label="Carregando projeto..." />}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={() => setAttempt((n) => n + 1)} />
      )}

      {status === 'success' && project && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-500">
                {project.objective}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Estado: {PROJECT_STATUS_LABELS[project.status]}
              </p>
            </div>
            {!isClosed && (
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Encerrar
                </button>
              </div>
            )}
          </div>

          {closeError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {closeError}
            </p>
          )}

          <section className="mt-8">
            <h2 className="text-sm font-medium text-slate-600">Histórico</h2>
            {history.length === 0 ? (
              <div className="mt-2">
                <EmptyState message="Nenhum evento registrado ainda." />
              </div>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {history.map((event) => (
                  <li key={event.id}>
                    •{' '}
                    {event.type === 'criado'
                      ? 'Projeto criado'
                      : `Estado alterado: ${
                          event.fromStatus
                            ? PROJECT_STATUS_LABELS[event.fromStatus]
                            : '—'
                        } → ${PROJECT_STATUS_LABELS[event.toStatus]}`}{' '}
                    — {new Date(event.occurredAt).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-medium text-slate-600">Landing Pages</h2>
              <div className="mt-2">
                <EmptyState message="Nenhuma landing page ainda." />
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-medium text-slate-600">
                Campanhas Google Ads
              </h2>
              <div className="mt-2">
                <EmptyState message="Nenhuma campanha ainda." />
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-medium text-slate-600">Relatórios</h2>
              <div className="mt-2">
                <EmptyState message="Nenhum relatório ainda." />
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-medium text-slate-600">Insights</h2>
              <div className="mt-2">
                <EmptyState message="Nenhum insight ainda." />
              </div>
            </section>
          </div>
        </>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title="Encerrar projeto"
        description={`Tem certeza de que deseja encerrar "${project?.name ?? ''}"? Esta ação é irreversível pela interface.`}
        confirmLabel={isClosing ? 'Encerrando...' : 'Sim, encerrar'}
        cancelLabel="Cancelar"
        onConfirm={() => void handleClose()}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </AppShell>
  )
}
