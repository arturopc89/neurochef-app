import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { useTaskStore } from '../../stores/taskStore'
import { supabase } from '../../lib/supabase'
import TaskForm from './TaskForm'

const categoryStyles = {
  nutricion: { bg: 'bg-sage-100', text: 'text-sage-600', label: 'Nutrición' },
  organizacion: { bg: 'bg-lavender-50', text: 'text-lavender-600', label: 'Organización' },
  bienestar: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Bienestar' },
  personal: { bg: 'bg-terra-100', text: 'text-terra-600', label: 'Personal' },
}

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false)
  const [subtasks, setSubtasks] = useState([])
  const [showSubForm, setShowSubForm] = useState(false)
  const { toggleTask, deleteTask, fetchSubtasks } = useTaskStore()

  const cat = categoryStyles[task.category]

  useEffect(() => {
    if (expanded) {
      fetchSubtasks(task.id).then(setSubtasks)
    }
  }, [expanded, task.id, fetchSubtasks])

  async function handleToggleSubtask(subtask) {
    const isCompleted = !subtask.is_completed
    await supabase
      .from('tasks')
      .update({ is_completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null })
      .eq('id', subtask.id)

    setSubtasks((prev) =>
      prev.map((s) => (s.id === subtask.id ? { ...s, is_completed: isCompleted } : s))
    )
  }

  function handleSubAdded(newSub) {
    setSubtasks((prev) => [...prev, newSub])
    setShowSubForm(false)
  }

  const completedSubs = subtasks.filter((s) => s.is_completed).length
  const totalSubs = subtasks.length

  return (
    <div className={`bg-white rounded-2xl border border-stone-100 transition hover:border-stone-200 ${task.is_completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Check circle */}
        <button
          onClick={() => toggleTask(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
            task.is_completed
              ? 'bg-sage-500 border-sage-500'
              : 'border-sage-300 hover:border-sage-400'
          }`}
        >
          {task.is_completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-text-muted hover:text-text-secondary transition flex-shrink-0"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Title */}
        <span className={`flex-1 text-sm font-medium ${task.is_completed ? 'line-through text-text-muted' : ''}`}>
          {task.title}
        </span>

        {/* Subtask count */}
        {totalSubs > 0 && (
          <span className="text-xs text-text-muted">
            {completedSubs}/{totalSubs}
          </span>
        )}

        {/* Category tag */}
        {cat && (
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${cat.bg} ${cat.text}`}>
            {cat.label}
          </span>
        )}

        {/* Delete */}
        <button
          onClick={() => deleteTask(task.id)}
          className="text-text-muted hover:text-rose-400 transition opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Subtasks */}
      {expanded && (
        <div className="px-4 pb-3 ml-9 border-t border-stone-50 pt-2">
          {subtasks.length === 0 && !showSubForm && (
            <p className="text-xs text-text-muted mb-2">
              Desglosá esta tarea en micro-pasos para que sea más fácil.
            </p>
          )}

          <div className="flex flex-col gap-1.5 mb-2">
            {subtasks.map((sub) => (
              <div key={sub.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleSubtask(sub)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                    sub.is_completed
                      ? 'bg-sage-400 border-sage-400'
                      : 'border-stone-300 hover:border-sage-400'
                  }`}
                >
                  {sub.is_completed && (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className={`text-xs ${sub.is_completed ? 'line-through text-text-muted' : 'text-text-secondary'}`}>
                  {sub.title}
                </span>
              </div>
            ))}
          </div>

          {showSubForm ? (
            <TaskForm
              parentTaskId={task.id}
              onAdded={handleSubAdded}
              placeholder="Agregar micro-paso..."
            />
          ) : (
            <button
              onClick={() => setShowSubForm(true)}
              className="text-xs text-sage-500 font-medium hover:underline"
            >
              + Agregar micro-paso
            </button>
          )}
        </div>
      )}
    </div>
  )
}
