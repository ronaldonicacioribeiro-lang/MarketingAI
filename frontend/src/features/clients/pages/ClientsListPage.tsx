import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { clientsApi } from '@/features/clients/api/clientsApi'
import type { Client } from '@/features/clients/api/clientsApi'

type Status = 'loading' | 'success' | 'error'

/** Lista de clientes ativos da Empresa — conforme tasks/003_clientes.md, Seção 7.1. */
export function ClientsListPage() {
  const { logout } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchClients = async () => {
      setStatus('loading')
      try {
        const data = await clientsApi.list()
        if (cancelled) return
        setClients(data)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setErrorMessage(
          extractAuthErrorMessage(error, 'Não foi possível carregar os clientes.'),
        )
        setStatus('error')
      }
    }

    void fetchClients()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Clientes</h1>
        <Link
          to="/clients/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Novo cliente
        </Link>
      </div>

      <div className="mt-6">
        {status === 'loading' && <LoadingState label="Carregando clientes..." />}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => setAttempt((n) => n + 1)} />
        )}

        {status === 'success' && clients.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <EmptyState message="Nenhum cliente cadastrado ainda." />
            <Link
              to="/clients/new"
              className="mt-4 inline-block rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              + Cadastrar primeiro cliente
            </Link>
          </div>
        )}

        {status === 'success' && clients.length > 0 && (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  to={`/clients/${client.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{client.name}</span>
                  <span aria-hidden="true" className="text-slate-400">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  )
}
