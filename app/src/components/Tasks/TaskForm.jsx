import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTaskStore } from '../../stores/taskStore'

const categories = [
  { value: 'nutricion', label: 'Nutrición', color: 'bg-sage-100 text-sage-600' },
  { value: 'organizacion', label: 'Organización', color: 'bg-lavender-50 text-lavender-600' },
  { value: 'bienestar', label: 'Bienestar', color: 'bg-rose-50 text-rose-600' },
  { value: 'personal', label: 'Personal', color: 'bg-terra-100 text-terra-600' },
]

export default function TaskForm({ parentTaskId, onAdded, placeholder }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [showCategories, setShowCategories] = useState(false)
  const addTask = useTaskStore((s) => s.addTask)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    const task = await addTask({
      title: title.trim(),
      category: category || null,
      parentTaskId,
    })

    if (task) {
      setTitle('')
      setCategory('')
      setShowCategories(false)
      onAdded?.(task)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="group">
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-stone-200 px-4 py-3 focus-within:border-sage-400 focus-within:ring-2 focus-within:ring-sage-400/20 transition">
        <Plus size={20} className="text-text-muted flex-shrink-0" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setShowCategories(true)}
          placeholder={placeholder || 'Agregar una tarea...'}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
        />
        {title.trim() && (
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-sage-500 text-white text-xs font-semibold hover:bg-sage-600 transition flex-shrink-0"
          >
            Agregar
          </button>
        )}
      </div>

      {showCategories && !parentTaskId && (
        <div className="flex gap-2 mt-2 ml-11">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(category === cat.value ? '' : cat.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                category === cat.value
                  ? cat.color + ' ring-2 ring-offset-1 ring-current'
                  : 'bg-cream-dark text-text-muted hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
