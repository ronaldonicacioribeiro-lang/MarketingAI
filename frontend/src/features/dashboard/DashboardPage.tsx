import { AppShell } from '@/components/layout/AppShell'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { SummaryCard } from '@/components/ui/SummaryCard'
import { useDashboardUser } from '@/features/dashboard/hooks/useDashboardUser'

/**
 * Ponto de entrada do usuário logo após o login — conforme
 * tasks/002_dashboard.md. Os quatro cartões de resumo permanecem em
 * estado vazio explícito nesta sprint: os módulos que os alimentariam
 * (Clientes, Projetos, Relatórios/Insights) ainda não existem
 * (Seção 4, Seção 9, Seção 10) — nenhum dado é fabricado.
 */
export function DashboardPage() {
  const { user, status, retry } = useDashboardUser()

  return (
    <AppShell>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

      {status === 'loading' && (
        <div className="mt-4">
          <LoadingState label="Carregando dados do usuário..." />
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4">
          <ErrorState
            message="Não foi possível carregar os dados do Dashboard."
            onRetry={retry}
          />
        </div>
      )}

      {status === 'success' && user && (
        <>
          <p className="mt-1 text-sm text-slate-500">
            Olá, {user.name} — {user.empresa.name}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryCard
              title="Clientes ativos"
              emptyMessage="Nenhum cliente cadastrado ainda."
            />
            <SummaryCard
              title="Projetos em andamento"
              emptyMessage="Nenhum projeto em andamento ainda."
            />
            <SummaryCard
              title="Aprovações pendentes"
              emptyMessage="Nenhuma aprovação pendente ainda."
            />
            <SummaryCard
              title="Relatórios recentes"
              emptyMessage="Nenhum relatório disponível ainda."
            />
          </div>
        </>
      )}
    </AppShell>
  )
}
