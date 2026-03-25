import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <p className="text-text-muted text-sm">Cargando usuarios...</p>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl mb-1">Usuarios</h1>
        <p className="text-text-secondary">{users.length} usuarios registrados</p>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-5 py-3 text-text-muted font-medium">Nombre</th>
              <th className="px-5 py-3 text-text-muted font-medium">Email</th>
              <th className="px-5 py-3 text-text-muted font-medium">Rol</th>
              <th className="px-5 py-3 text-text-muted font-medium">Registro</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="border-b border-stone-50 hover:bg-cream transition">
                  <td className="px-5 py-3 font-medium">{user.full_name || '—'}</td>
                  <td className="px-5 py-3 text-text-secondary">{user.email || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-terra-100 text-terra-600'
                        : 'bg-cream-dark text-text-muted'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
