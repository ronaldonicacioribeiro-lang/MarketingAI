import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, extractAuthErrorMessage } from '@/features/auth/api/authApi'

/**
 * Tela de bootstrap do primeiro administrador — conforme
 * tasks/001_autenticacao.md, Seção 7.2.
 *
 * O campo "Nome da empresa" foi confirmado como adição necessária ao
 * wireframe original da Seção 7.2 (ver Nota na Seção 9 da task): sem ele,
 * o campo obrigatório `Empresa.name` (Seção 9) teria que ser fabricado.
 */
export function FirstAdminSetupPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [empresaName, setEmpresaName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      await authApi.createFirstAdmin({ name, email, password, empresaName })
      // Seção 7.2: não faz login automático — login continua sendo um
      // passo explícito e auditável.
      navigate('/login', { replace: true })
    } catch (err) {
      setError(
        extractAuthErrorMessage(
          err,
          'Não foi possível concluir o cadastro. Verifique os dados informados.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">
          Configurar primeiro acesso
        </h1>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label htmlFor="empresaName" className="block text-sm font-medium text-slate-700">
              Nome da empresa
            </label>
            <input
              id="empresaName"
              name="empresaName"
              type="text"
              required
              value={empresaName}
              onChange={(event) => setEmpresaName(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700"
            >
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60"
          >
            {isSubmitting ? 'Criando...' : 'Criar administrador'}
          </button>
        </form>
      </div>
    </div>
  )
}
