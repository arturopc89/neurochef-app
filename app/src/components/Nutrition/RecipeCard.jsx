import { Clock, Users, ChefHat } from 'lucide-react'

const tagColors = {
  'antiinflamatorio': 'bg-sage-100 text-sage-600',
  'sin-gluten': 'bg-terra-100 text-terra-600',
  'sin-lacteos': 'bg-lavender-50 text-lavender-600',
  'rapido': 'bg-rose-50 text-rose-600',
  'batch-cooking': 'bg-cream-dark text-text-secondary',
  'omega-3': 'bg-sage-50 text-sage-500',
}

const difficultyLabel = {
  'facil': 'Fácil',
  'medio': 'Medio',
  'avanzado': 'Avanzado',
}

export default function RecipeCard({ recipe, onClick }) {
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)

  return (
    <button
      onClick={() => onClick(recipe)}
      className="bg-white rounded-2xl border border-stone-100 p-5 text-left transition hover:border-stone-200 hover:shadow-sm w-full"
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {recipe.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-md text-xs font-medium ${tagColors[tag] || 'bg-cream-dark text-text-muted'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title & description */}
      <h3 className="font-body text-base font-semibold mb-1">{recipe.title}</h3>
      <p className="text-text-muted text-sm line-clamp-2 mb-4">{recipe.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {totalTime} min
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {recipe.servings}
        </span>
        <span className="flex items-center gap-1">
          <ChefHat size={14} />
          {difficultyLabel[recipe.difficulty] || recipe.difficulty}
        </span>
      </div>
    </button>
  )
}
