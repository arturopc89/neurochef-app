import { useState } from 'react'
import { ArrowLeft, Clock, Users, ChefHat, ChevronRight } from 'lucide-react'

const tagColors = {
  'antiinflamatorio': 'bg-sage-100 text-sage-600',
  'sin-gluten': 'bg-terra-100 text-terra-600',
  'sin-lacteos': 'bg-lavender-50 text-lavender-600',
  'rapido': 'bg-rose-50 text-rose-600',
  'batch-cooking': 'bg-cream-dark text-text-secondary',
  'omega-3': 'bg-sage-50 text-sage-500',
}

export default function RecipeDetail({ recipe, onBack }) {
  const [cookingMode, setCookingMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)
  const steps = recipe.steps || []
  const ingredients = recipe.ingredients || []

  if (cookingMode) {
    return (
      <div className="fixed inset-0 bg-cream z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button onClick={() => setCookingMode(false)} className="text-text-muted text-sm font-medium">
              Salir
            </button>
            <span className="text-xs text-text-muted font-semibold">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <div className="w-12" />
          </div>
          {/* Progress bar */}
          <div className="max-w-lg mx-auto mt-3">
            <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-2xl font-display mx-auto mb-6">
              {currentStep + 1}
            </div>
            <p className="text-lg leading-relaxed">{steps[currentStep]}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-stone-200 bg-white">
          <div className="flex gap-3 max-w-lg mx-auto">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-text-secondary hover:bg-cream-dark transition"
              >
                Anterior
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 py-3 rounded-xl bg-sage-500 text-white text-sm font-semibold hover:bg-sage-600 transition flex items-center justify-center gap-2"
              >
                Siguiente <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setCookingMode(false)}
                className="flex-1 py-3 rounded-xl bg-terra-400 text-white text-sm font-semibold hover:bg-terra-500 transition"
              >
                ¡Listo! 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary mb-6 transition"
      >
        <ArrowLeft size={16} />
        Volver a recetas
      </button>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {recipe.tags?.map((tag) => (
          <span
            key={tag}
            className={`px-3 py-1 rounded-lg text-xs font-medium ${tagColors[tag] || 'bg-cream-dark text-text-muted'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl mb-2">{recipe.title}</h1>
      <p className="text-text-secondary mb-6">{recipe.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-6 mb-8 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <Clock size={16} />
          {totalTime} min
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={16} />
          {recipe.servings} porciones
        </span>
        <span className="flex items-center gap-1.5">
          <ChefHat size={16} />
          {recipe.difficulty === 'facil' ? 'Fácil' : recipe.difficulty === 'medio' ? 'Medio' : 'Avanzado'}
        </span>
      </div>

      {/* Cook mode button */}
      <button
        onClick={() => { setCookingMode(true); setCurrentStep(0) }}
        className="w-full py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition mb-8"
      >
        Modo cocina — paso a paso
      </button>

      {/* Ingredients */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
        <h2 className="font-body text-base font-semibold mb-4">Ingredientes</h2>
        <div className="flex flex-col gap-2.5">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full border-2 border-sage-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">{ing.name}</span>
                <span className="text-text-muted"> — {ing.amount}</span>
                {ing.notes && <span className="text-text-muted text-xs ml-1">({ing.notes})</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="font-body text-base font-semibold mb-4">Preparación</h2>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 text-sm">
              <div className="w-7 h-7 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-text-secondary leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
