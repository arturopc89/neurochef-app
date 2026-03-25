import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const authLoading = useAuthStore((s) => s.loading)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuthStore()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, fullName)
      } else {
        await signIn(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!authLoading && user) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-sage-600 mb-2">
            Neuro<span className="text-terra-400">Chef</span>
          </h1>
          <p className="text-text-secondary">
            Tu sistema para un cerebro que funciona diferente
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100"
        >
          <h2 className="font-body text-xl font-semibold mb-6">
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {isSignUp && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 transition"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sage-500 text-white font-semibold text-sm hover:bg-sage-600 transition disabled:opacity-50"
          >
            {loading
              ? 'Cargando...'
              : isSignUp
                ? 'Crear cuenta'
                : 'Entrar'}
          </button>

          <p className="text-center text-sm text-text-muted mt-4">
            {isSignUp ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
              className="text-sage-500 font-semibold hover:underline"
            >
              {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
