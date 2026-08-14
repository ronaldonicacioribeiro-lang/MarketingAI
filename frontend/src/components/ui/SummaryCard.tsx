import type { ReactNode } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'

/**
 * Cartão de resumo reutilizável (título, valor ou estado vazio, ícone
 * opcional), conforme tasks/002_dashboard.md (Seção 8). Não contém
 * lógica de negócio de nenhum módulo — apenas renderiza o que recebe.
 */
interface SummaryCardProps {
  title: string
  value?: string | number
  emptyMessage?: string
  icon?: ReactNode
}

export function SummaryCard({
  title,
  value,
  emptyMessage = 'Sem dados disponíveis.',
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        {icon}
      </div>
      <div className="mt-2">
        {value !== undefined ? (
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </div>
    </div>
  )
}
