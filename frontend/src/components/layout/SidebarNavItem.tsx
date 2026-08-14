import { NavLink } from 'react-router-dom'

/**
 * Item individual de navegação, com estado ativo/desabilitado, conforme
 * tasks/002_dashboard.md (Seção 7.2, Seção 8). Itens sem `path`/`enabled`
 * permanecem visíveis, mas não navegáveis nem clicáveis.
 */
interface SidebarNavItemProps {
  label: string
  path?: string
  enabled: boolean
}

export function SidebarNavItem({ label, path, enabled }: SidebarNavItemProps) {
  if (!enabled || !path) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm text-slate-400"
      >
        {label}
        <span className="text-xs text-slate-300">em breve</span>
      </span>
    )
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm font-medium transition ${
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-slate-100'
        }`
      }
    >
      {label}
    </NavLink>
  )
}
