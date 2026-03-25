import { useEffect, useState } from 'react'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from '../components/Nutrition/RecipeCard'
import RecipeDetail from '../components/Nutrition/RecipeDetail'

const filters = [
  { value: 'todos', label: 'Todas' },
  { value: 'antiinflamatorio', label: 'Antiinflamatorio' },
  { value: 'sin-gluten', label: 'Sin gluten' },
  { value: 'sin-lacteos', label: 'Sin lácteos' },
  { value: 'rapido', label: 'Rápido (<15 min)' },
  { value: 'batch-cooking', label: 'Batch cooking' },
]

export default function NutritionPage() {
  const { recipes, loading, activeFilter, fetchRecipes, setFilter } = useRecipeStore()
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    )
  }

  const filtered = activeFilter === 'todos'
    ? recipes
    : recipes.filter((r) => r.tags?.includes(activeFilter))

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Recetas de Adriana</h1>
        <p className="text-text-secondary">
          Nutrición funcional antiinflamatoria para tu cerebro.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeFilter === f.value
                ? 'bg-sage-500 text-white'
                : 'bg-white text-text-secondary border border-stone-200 hover:bg-cream-dark'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-muted text-sm text-center py-8">Cargando recetas...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🥗</div>
          <h3 className="font-body text-lg font-semibold mb-1">Sin recetas en esta categoría</h3>
          <p className="text-text-muted text-sm">Probá otro filtro o volvé pronto.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={setSelectedRecipe}
            />
          ))}
        </div>
      )}
    </div>
  )
}
