import { SidebarNavItem } from '@/components/layout/SidebarNavItem'

/**
 * Módulos funcionais do MVP, na mesma ordem de organização definida em
 * docs/03_ARCHITECTURE.md (Seção 3) — ver tasks/002_dashboard.md,
 * Seção 7.2. O módulo SEO é omitido (fora do MVP até a Versão 2.0).
 *
 * "Dashboard" (Sprint 002), "Clientes" (Sprint 003) e "Biblioteca"
 * (Sprint 005) são navegáveis; os demais permanecem visíveis e
 * desabilitados — nenhuma rota ou página "em construção" é criada para
 * eles (simplicidade deliberada, docs/00_PRODUCT_BLUEPRINT.md).
 *
 * "Empresa" no singular (não "Empresas") e "Agentes IA" mapeado ao
 * módulo IA — ver Notas de arquitetura em tasks/002_dashboard.md,
 * Seção 7.2.
 */
const SIDEBAR_ITEMS: { label: string; path?: string; enabled: boolean }[] = [
  { label: 'Dashboard', path: '/dashboard', enabled: true },
  { label: 'Clientes', path: '/clients', enabled: true },
  { label: 'Projetos', enabled: false },
  { label: 'Landing Pages', enabled: false },
  { label: 'Google Ads', enabled: false },
  { label: 'Analytics', enabled: false },
  { label: 'Relatórios', enabled: false },
  { label: 'Insights', enabled: false },
  { label: 'Biblioteca', path: '/library', enabled: true },
  { label: 'Agentes IA', enabled: false },
  { label: 'Empresa', enabled: false },
  { label: 'Configurações', enabled: false },
]

export function Sidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="w-60 shrink-0 border-r border-slate-200 bg-white p-4"
    >
      <ul className="space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <li key={item.label}>
            <SidebarNavItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
