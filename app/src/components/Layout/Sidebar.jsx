import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Timer, UtensilsCrossed, Users, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/tareas', icon: CheckSquare, label: 'Tareas' },
  { to: '/timer', icon: Timer, label: 'Timer' },
  { to: '/nutricion', icon: UtensilsCrossed, label: 'Nutrición' },
  { to: '/comunidad', icon: Users, label: 'Comunidad' },
]

export default function Sidebar() {
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-200 flex flex-col p-6 max-md:hidden">
      <a href="/" className="font-display text-2xl text-sage-600 mb-10">
        Neuro<span className="text-terra-400">Chef</span>
      </a>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sage-50 text-sage-600'
                  : 'text-text-secondary hover:bg-cream-dark'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={signOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-cream-dark transition-colors"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>
    </aside>
  )
}
