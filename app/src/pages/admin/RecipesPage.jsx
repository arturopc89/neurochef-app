import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const tagOptions = ['antiinflamatorio', 'sin-gluten', 'sin-lacteos', 'rapido', 'batch-cooking', 'omega-3']

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', prep_time: '', servings: '', difficulty: 'facil',
    tags: [], ingredients: '', steps: '',
  })

  useEffect(() => {
    fetchRecipes()
  }, [])

  async function fetchRecipes() {
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
    setRecipes(data || [])
    setLoading(false)
  }

  function resetForm() {
    setForm({ title: '', description: '', prep_time: '', servings: '', difficulty: 'facil', tags: [], ingredients: '', steps: '' })
    setEditingId(null)
    setShowForm(false)
  }

  function startEdit(recipe) {
    setForm({
      title: recipe.title || '',
      description: recipe.description || '',
      prep_time: recipe.prep_time || '',
      servings: recipe.servings || '',
      difficulty: recipe.difficulty || 'facil',
      tags: recipe.tags || [],
      ingredients: (recipe.ingredients || []).map((i) => typeof i === 'string' ? i : i.name).join('\n'),
      steps: (recipe.steps || []).join('\n'),
    })
    setEditingId(recipe.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      prep_time: parseInt(form.prep_time) || 0,
      servings: parseInt(form.servings) || 1,
      difficulty: form.difficulty,
      tags: form.tags,
      ingredients: form.ingredients.split('\n').filter(Boolean).map((name) => ({ name: name.trim() })),
      steps: form.steps.split('\n').filter(Boolean).map((s) => s.trim()),
    }

    if (editingId) {
      await supabase.from('recipes').update(payload).eq('id', editingId)
    } else {
      await supabase.from('recipes').insert([payload])
    }

    resetForm()
    fetchRecipes()
  }

  async function deleteRecipe(id) {
    await supabase.from('recipes').delete().eq('id', id)
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  function toggleTag(tag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }))
  }

  if (loading) return <p className="text-text-muted text-sm">Cargando recetas...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-1">Recetas</h1>
          <p className="text-text-secondary">{recipes.length} recetas publicadas</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-500 text-white text-sm font-semibold hover:bg-sage-600 transition"
        >
          <Plus size={16} />
          Nueva receta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Editar receta' : 'Nueva receta'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Título</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Descripción</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Tiempo (min)</label>
              <input
                type="number"
                value={form.prep_time}
                onChange={(e) => setForm((f) => ({ ...f, prep_time: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Porciones</label>
              <input
                type="number"
                value={form.servings}
                onChange={(e) => setForm((f) => ({ ...f, servings: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Dificultad</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400"
              >
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-text-secondary mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    form.tags.includes(tag)
                      ? 'bg-sage-100 text-sage-600 ring-2 ring-sage-300'
                      : 'bg-cream-dark text-text-muted hover:bg-stone-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Ingredientes (uno por línea)</label>
              <textarea
                value={form.ingredients}
                onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Pasos (uno por línea)</label>
              <textarea
                value={form.steps}
                onChange={(e) => setForm((f) => ({ ...f, steps: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2.5 bg-cream border border-stone-200 rounded-xl text-sm outline-none focus:border-sage-400 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sage-500 text-white text-sm font-semibold hover:bg-sage-600 transition"
            >
              {editingId ? 'Guardar cambios' : 'Crear receta'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-cream-dark text-text-secondary text-sm font-medium hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-5 py-3 text-text-muted font-medium">Título</th>
              <th className="px-5 py-3 text-text-muted font-medium">Tiempo</th>
              <th className="px-5 py-3 text-text-muted font-medium">Dificultad</th>
              <th className="px-5 py-3 text-text-muted font-medium">Tags</th>
              <th className="px-5 py-3 text-text-muted font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                  No hay recetas. Creá la primera.
                </td>
              </tr>
            ) : (
              recipes.map((r) => (
                <tr key={r.id} className="border-b border-stone-50 hover:bg-cream transition">
                  <td className="px-5 py-3 font-medium">{r.title}</td>
                  <td className="px-5 py-3 text-text-secondary">{r.prep_time} min</td>
                  <td className="px-5 py-3 text-text-secondary capitalize">{r.difficulty}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(r.tags || []).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-lg bg-sage-50 text-sage-600 text-xs">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(r)} className="text-text-muted hover:text-sage-600 transition">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deleteRecipe(r.id)} className="text-text-muted hover:text-rose-400 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
