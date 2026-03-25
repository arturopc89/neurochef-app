import { useEffect, useState } from 'react'
import { Heart, Trash2, Send } from 'lucide-react'
import { useCommunityStore } from '../stores/communityStore'
import { useAuthStore } from '../stores/authStore'

const categories = [
  { value: 'logro', label: '🏆 Logro', color: 'bg-sage-100 text-sage-600' },
  { value: 'pregunta', label: '❓ Pregunta', color: 'bg-lavender-50 text-lavender-600' },
  { value: 'tip', label: '💡 Tip', color: 'bg-terra-100 text-terra-600' },
  { value: 'desahogo', label: '💬 Desahogo', color: 'bg-rose-50 text-rose-600' },
]

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'logro', label: '🏆 Logros' },
  { value: 'pregunta', label: '❓ Preguntas' },
  { value: 'tip', label: '💡 Tips' },
  { value: 'desahogo', label: '💬 Desahogo' },
]

const categoryStyles = {
  logro: { bg: 'bg-sage-50', border: 'border-sage-200', label: '🏆 Logro' },
  pregunta: { bg: 'bg-lavender-50', border: 'border-lavender-200', label: '❓ Pregunta' },
  tip: { bg: 'bg-terra-50', border: 'border-terra-200', label: '💡 Tip' },
  desahogo: { bg: 'bg-rose-50', border: 'border-rose-100', label: '💬 Desahogo' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `Hace ${days}d`
}

export default function CommunityPage() {
  const { posts, loading, filter, fetchPosts, setFilter, addPost, toggleLike, deletePost } = useCommunityStore()
  const user = useAuthStore((s) => s.user)
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('logro')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function handlePost(e) {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    await addPost(content.trim(), category)
    setContent('')
    setPosting(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Comunidad</h1>
        <p className="text-text-secondary">
          Un espacio seguro. Compartí, preguntá, celebrá. Sin juicios.
        </p>
      </div>

      {/* New post form */}
      <form onSubmit={handlePost} className="bg-white rounded-2xl border border-stone-100 p-5 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué querés compartir hoy?"
          rows={3}
          className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-text-muted mb-3"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
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
          <button
            type="submit"
            disabled={!content.trim() || posting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-500 text-white text-xs font-semibold hover:bg-sage-600 transition disabled:opacity-50"
          >
            <Send size={14} />
            Publicar
          </button>
        </div>
      </form>

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

      {/* Posts */}
      {loading ? (
        <p className="text-text-muted text-sm text-center py-8">Cargando...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-body text-lg font-semibold mb-1">Sé el/la primera en publicar</h3>
          <p className="text-text-muted text-sm">
            Compartí un logro, una pregunta o simplemente cómo te sentís hoy.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => {
            const style = categoryStyles[post.category] || categoryStyles.logro
            return (
              <div key={post.id} className={`rounded-2xl border p-5 ${style.bg} ${style.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sage-400 flex items-center justify-center text-white text-xs font-bold">
                      {(post.author_name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">{post.author_name || 'Anónimo'}</span>
                      <span className="text-xs text-text-muted ml-2">{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{style.label}</span>
                </div>

                <p className="text-sm leading-relaxed mb-3">{post.content}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition ${
                      post.liked ? 'text-rose-400' : 'text-text-muted hover:text-rose-400'
                    }`}
                  >
                    <Heart size={14} fill={post.liked ? 'currentColor' : 'none'} />
                    {post.likes_count > 0 && post.likes_count}
                  </button>
                  {user?.id === post.user_id && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-text-muted hover:text-rose-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
