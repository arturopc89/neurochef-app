import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Timer, UtensilsCrossed, Users } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/tareas', icon: CheckSquare, label: 'Tareas' },
  { to: '/timer', icon: Timer, label: 'Timer' },
  { to: '/nutricion', icon: UtensilsCrossed, label: 'Nutrición' },
  { to: '/comunidad', icon: Users, label: 'Comunidad' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around py-2 px-4 md:hidden z-50">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              isActive ? 'text-sage-600' : 'text-text-muted'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
