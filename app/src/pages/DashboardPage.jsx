import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'
import { useTimerStore } from '../stores/timerStore'
import TaskCard from '../components/Tasks/TaskCard'
import TaskForm from '../components/Tasks/TaskForm'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { tasks, fetchTasks } = useTaskStore()
  const { todayMinutes, fetchTodaySessions } = useTimerStore()
  const name = user?.user_metadata?.full_name || 'amigo/a'

  useEffect(() => {
    fetchTasks()
    fetchTodaySessions()
  }, [fetchTasks, fetchTodaySessions])

  const pendingTasks = tasks.filter((t) => !t.is_completed)
  const completedToday = tasks.filter(
    (t) => t.is_completed && t.completed_at && new Date(t.completed_at).toDateString() === new Date().toDateString()
  )

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">
          {getGreeting()}, <span className="text-sage-500">{name}</span>
        </h1>
        <p className="text-text-secondary">
          Cada pequeño paso cuenta. ¿Qué querés lograr hoy?
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 grid-cols-3 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-stone-100 text-center">
          <div className="text-2xl font-display text-sage-500">{pendingTasks.length}</div>
          <p className="text-text-muted text-xs mt-1">Pendientes</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-stone-100 text-center">
          <div className="text-2xl font-display text-terra-400">{completedToday.length}</div>
          <p className="text-text-muted text-xs mt-1">Hechas hoy</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-stone-100 text-center">
          <div className="text-2xl font-display text-lavender-400">{todayMinutes}</div>
          <p className="text-text-muted text-xs mt-1">Min enfoque</p>
        </div>
      </div>

      {/* Quick add */}
      <div className="mb-6">
        <TaskForm placeholder="¿Qué querés hacer hoy?" />
      </div>

      {/* Pending tasks */}
      {pendingTasks.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-body text-sm font-semibold text-text-secondary">Tus tareas pendientes</h2>
            <Link to="/tareas" className="text-xs text-sage-500 font-medium flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {pendingTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="group">
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <h3 className="font-body text-lg font-semibold mb-1">Tu día está limpio</h3>
          <p className="text-text-muted text-sm">
            Agregá algo pequeño arriba. No tiene que ser perfecto.
          </p>
        </div>
      )}

      {/* Completed today celebration */}
      {completedToday.length > 0 && (
        <div className="bg-sage-50 rounded-2xl p-5 border border-sage-200 text-center">
          <p className="text-sage-600 text-sm font-medium">
            ¡Completaste {completedToday.length} {completedToday.length === 1 ? 'tarea' : 'tareas'} hoy! Cada paso cuenta 💚
          </p>
        </div>
      )}
    </div>
  )
}
