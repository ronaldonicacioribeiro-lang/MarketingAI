import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { templatesApi } from '@/features/library/api/templatesApi'
import type { Template } from '@/features/library/api/templatesApi'

type Status = 'loading' | 'success' | 'error'

/** Lista de templates ativos da Empresa — conforme tasks/005_templates.md, Seção 7.1. */
export function TemplatesListPage() {
  const { logout } = useAuth()
  const [templates, setTemplates] = useState<Template[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchTemplates = async () => {
      setStatus('loading')
      try {
        const data = await templatesApi.list()
        if (cancelled) return
        setTemplates(data)
        setStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setErrorMessage(
          extractAuthErrorMessage(error, 'Não foi possível carregar os templates.'),
        )
        setStatus('error')
      }
    }

    void fetchTemplates()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Biblioteca</h1>
        <Link
          to="/library/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Novo template
        </Link>
      </div>

      <div className="mt-6">
        {status === 'loading' && <LoadingState label="Carregando templates..." />}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => setAttempt((n) => n + 1)} />
        )}

        {status === 'success' && templates.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <EmptyState message="Nenhum template cadastrado ainda." />
            <Link
              to="/library/new"
              className="mt-4 inline-block rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              + Cadastrar primeiro template
            </Link>
          </div>
        )}

        {status === 'success' && templates.length > 0 && (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {templates.map((template) => (
              <li key={template.id}>
                <Link
                  to={`/library/${template.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{template.name}</span>
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
