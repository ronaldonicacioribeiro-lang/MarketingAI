/**
 * Indicador de erro reutilizável, com ação de nova tentativa, conforme
 * tasks/002_dashboard.md (Seção 8) — usado por qualquer seção cuja busca
 * de dados ao backend falhe.
 */
interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="space-y-2">
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}
