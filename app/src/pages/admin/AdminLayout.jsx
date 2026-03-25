import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { LayoutDashboard, Mail, Users, MessageSquare, UtensilsCrossed, Bell, ArrowLeft } from 'lucide-react'
import { useAdmin } from '../../hooks/useAdmin'

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/leads', icon: Mail, label: 'Leads' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  { to: '/admin/comunidad', icon: MessageSquare, label: 'Comunidad' },
  { to: '/admin/recetas', icon: UtensilsCrossed, label: 'Recetas' },
  { to: '/admin/notificaciones', icon: Bell, label: 'Notificaciones' },
]

export default function AdminLayout() {
  const { isAdmin } = useAdmin()

  if (!isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-200 flex flex-col p-6 max-md:hidden">
        <div className="mb-8">
          <a href="/" className="font-display text-2xl text-sage-600">
            Neuro<span className="text-terra-400">Chef</span>
          </a>
          <span className="block text-xs text-terra-500 font-semibold mt-1">Panel Admin</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {adminNav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-terra-100 text-terra-600'
                    : 'text-text-secondary hover:bg-cream-dark'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-cream-dark transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a la app
        </NavLink>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
