import { useEffect, useState } from 'react'
import { Users, Mail, MessageSquare, CheckSquare, UtensilsCrossed, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <p className="text-3xl font-display text-text-primary">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLeads: 0,
    totalPosts: 0,
    totalTasks: 0,
    totalRecipes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [users, leads, posts, tasks, recipes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('waitlist').select('id', { count: 'exact', head: true }),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('recipes').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        totalUsers: users.count || 0,
        totalLeads: leads.count || 0,
        totalPosts: posts.count || 0,
        totalTasks: tasks.count || 0,
        totalRecipes: recipes.count || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-text-muted text-sm">Cargando métricas...</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Panel de Adriana</h1>
        <p className="text-text-secondary">Vista general de NeuroChef</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Usuarios registrados" value={stats.totalUsers} color="bg-sage-50 text-sage-600" />
        <StatCard icon={Mail} label="Emails en waitlist" value={stats.totalLeads} color="bg-terra-50 text-terra-500" />
        <StatCard icon={MessageSquare} label="Posts comunidad" value={stats.totalPosts} color="bg-rose-50 text-rose-600" />
        <StatCard icon={CheckSquare} label="Tareas creadas" value={stats.totalTasks} color="bg-lavender-50 text-lavender-600" />
        <StatCard icon={UtensilsCrossed} label="Recetas" value={stats.totalRecipes} color="bg-sage-50 text-sage-600" />
        <StatCard icon={TrendingUp} label="Tasa de conversión" value={stats.totalUsers > 0 && stats.totalLeads > 0 ? `${Math.round((stats.totalUsers / stats.totalLeads) * 100)}%` : '—'} color="bg-terra-50 text-terra-500" />
      </div>
    </div>
  )
}
