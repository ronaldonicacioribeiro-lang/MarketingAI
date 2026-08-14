import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { clientsApi } from '@/features/clients/api/clientsApi'
import type { Client } from '@/features/clients/api/clientsApi'
import { ClientProjectsSection } from '@/features/projects/components/ClientProjectsSection'

type Status = 'loading' | 'success' | 'error'

/**
 * Detalhe do cliente — nome, contexto, status reais, e seções em estado
 * vazio explícito para Projetos/Landing Pages/Campanhas/Relatórios/
 * Insights, conforme tasks/003_clientes.md, Seção 7.3. Nenhum dado
 * desses módulos futuros é referenciado como se existisse de verdade.
 */
export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [client, setClient] = useState<Client | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [archiveError, setArchiveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchClient = async () => {
      setStatus('loading')
      try {
        const data = await clientsApi.getById(id)
        if (cancelled) return
        setClient(data)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setErrorMessage(
          extractAuthErrorMessage(error, 'Não foi possível carregar o cliente.'),
        )
        setStatus('error')
      }
    }

    void fetchClient()

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
      await clientsApi.archive(id)
      navigate('/clients', { replace: true })
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout()
        return
      }
      setArchiveError(
        extractAuthErrorMessage(error, 'Não foi possível arquivar o cliente.'),
      )
      setIsArchiving(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <AppShell>
      {status === 'loading' && <LoadingState label="Carregando cliente..." />}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={() => setAttempt((n) => n + 1)} />
      )}

      {status === 'success' && client && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{client.name}</h1>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-500">
                {client.context || 'Sem contexto registrado.'}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/clients/${client.id}/edit`}
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

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ClientProjectsSection clientId={client.id} />
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
            <section className="rounded-lg border border-slate-200 bg-white p-4 sm:col-span-2">
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
        title="Arquivar cliente"
        description={`Tem certeza de que deseja arquivar "${client?.name ?? ''}"? Esta ação é irreversível pela interface.`}
        confirmLabel={isArchiving ? 'Arquivando...' : 'Sim, arquivar'}
        cancelLabel="Cancelar"
        onConfirm={() => void handleArchive()}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </AppShell>
  )
}
