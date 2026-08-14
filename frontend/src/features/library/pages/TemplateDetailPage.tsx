import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { templatesApi } from '@/features/library/api/templatesApi'
import type { Template } from '@/features/library/api/templatesApi'

type Status = 'loading' | 'success' | 'error'

/**
 * Detalhe do template — nome, descrição, conteúdo e status reais, e a
 * seção "Landing Pages geradas a partir deste template" em estado vazio
 * explícito, conforme tasks/005_templates.md, Seção 7.3. Nenhum dado de
 * Landing Page é referenciado como se existisse de verdade.
 */
export function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [template, setTemplate] = useState<Template | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [archiveError, setArchiveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchTemplate = async () => {
      setStatus('loading')
      try {
        const data = await templatesApi.getById(id)
        if (cancelled) return
        setTemplate(data)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setErrorMessage(
          extractAuthErrorMessage(error, 'Não foi possível carregar o template.'),
        )
        setStatus('error')
      }
    }

    void fetchTemplate()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, attempt])

  const handleArchive = async () => {
    if (!id) return
    setIsArchiving(true)
    setArchiveError(null)
    try {
      await templatesApi.archive(id)
      navigate('/library', { replace: true })
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout()
        return
      }
      setArchiveError(
        extractAuthErrorMessage(error, 'Não foi possível arquivar o template.'),
      )
      setIsArchiving(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <AppShell>
      {status === 'loading' && <LoadingState label="Carregando template..." />}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={() => setAttempt((n) => n + 1)} />
      )}

      {status === 'success' && template && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{template.name}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {template.description || 'Sem descrição registrada.'}
              </p>
              <p className="mt-3 whitespace-pre-line rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                {template.content || 'Sem conteúdo registrado.'}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/library/${template.id}/edit`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Arquivar
              </button>
            </div>
          </div>

          {archiveError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {archiveError}
            </p>
          )}

          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-medium text-slate-600">
              Landing Pages geradas a partir deste template
            </h2>
            <div className="mt-2">
              <EmptyState message="Nenhuma landing page ainda." />
            </div>
          </section>
        </>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title="Arquivar template"
        description={`Tem certeza de que deseja arquivar "${template?.name ?? ''}"? Esta ação é irreversível pela interface.`}
        confirmLabel={isArchiving ? 'Arquivando...' : 'Sim, arquivar'}
        cancelLabel="Cancelar"
        onConfirm={() => void handleArchive()}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </AppShell>
  )
}
