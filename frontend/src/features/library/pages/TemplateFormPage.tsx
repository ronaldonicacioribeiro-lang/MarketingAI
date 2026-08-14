import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { extractAuthErrorMessage, isUnauthorizedError } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { templatesApi } from '@/features/library/api/templatesApi'

type LoadStatus = 'loading' | 'success' | 'error'

/**
 * Formulário de cadastro/edição de template — mesmo componente
 * reutilizado para as duas ações, conforme tasks/005_templates.md,
 * Seção 7.2.
 */
export function TemplateFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
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

    const fetchTemplate = async () => {
      setLoadStatus('loading')
      try {
        const template = await templatesApi.getById(id)
        if (cancelled) return
        setName(template.name)
        setDescription(template.description ?? '')
        setContent(template.content ?? '')
        setLoadStatus('success')
      } catch (error) {
        if (cancelled) return
        if (isUnauthorizedError(error)) {
          logout()
          return
        }
        setLoadError(
          extractAuthErrorMessage(error, 'Não foi possível carregar o template.'),
        )
        setLoadStatus('error')
      }
    }

    void fetchTemplate()

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
        await templatesApi.update(id, { name, description, content })
        navigate(`/library/${id}`, { replace: true })
      } else {
        const template = await templatesApi.create({ name, description, content })
        navigate(`/library/${template.id}`, { replace: true })
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout()
        return
      }
      setSubmitError(
        extractAuthErrorMessage(error, 'Não foi possível salvar o template.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      <h1 className="text-xl font-semibold text-slate-900">
        {isEditing ? 'Editar template' : 'Novo template'}
      </h1>

      {loadStatus === 'loading' && (
        <div className="mt-4">
          <LoadingState label="Carregando template..." />
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
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Descrição
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-slate-700"
            >
              Conteúdo
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

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
