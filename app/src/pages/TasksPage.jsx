import { useEffect, useState } from 'react'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/Tasks/TaskCard'
import TaskForm from '../components/Tasks/TaskForm'

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'organizacion', label: 'Organización' },
  { value: 'bienestar', label: 'Bienestar' },
  { value: 'personal', label: 'Personal' },
]

export default function TasksPage() {
  const { tasks, loading, fetchTasks } = useTaskStore()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.category === filter)
  const pending = filtered.filter((t) => !t.is_completed)
  const completed = filtered.filter((t) => t.is_completed)

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Mis tareas</h1>
        <p className="text-text-secondary">
          Desglosá cada tarea en micro-pasos. Un paso a la vez.
        </p>
      </div>

      <div className="mb-6">
        <TaskForm />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              filter === f.value
                ? 'bg-sage-500 text-white'
                : 'bg-white text-text-secondary border border-stone-200 hover:bg-cream-dark'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-muted text-sm text-center py-8">Cargando tareas...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="font-body text-lg font-semibold mb-1">Sin tareas todavía</h3>
          <p className="text-text-muted text-sm">
            Empezá agregando algo pequeño. Cada paso cuenta.
          </p>
        </div>
      ) : (
        <>
          {/* Pending */}
          {pending.length > 0 && (
            <div className="flex flex-col gap-2 mb-6">
              {pending.map((task) => (
                <div key={task.id} className="group">
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Completadas — ¡bien hecho!
              </p>
              <div className="flex flex-col gap-2">
                {completed.map((task) => (
                  <div key={task.id} className="group">
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
