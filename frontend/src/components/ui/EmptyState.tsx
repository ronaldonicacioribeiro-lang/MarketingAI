/**
 * Componente genérico reutilizável para comunicar ausência de dado —
 * usado por qualquer módulo futuro, conforme tasks/002_dashboard.md
 * (Seção 8). Nunca deve ser usado para esconder um erro; apenas para
 * indicar "não há dado real disponível ainda".
 */
interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="text-sm text-slate-400">{message}</p>
}
