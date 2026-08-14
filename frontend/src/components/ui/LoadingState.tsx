/**
 * Indicador de carregamento reutilizável, conforme tasks/002_dashboard.md
 * (Seção 8) — usado por qualquer seção com dependência de rede.
 */
interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center gap-2 text-sm text-slate-500">
      <span
        aria-hidden="true"
        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
      />
      {label}
    </div>
  )
}
