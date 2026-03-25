import { useEffect, useState } from 'react'
import { Trash2, Pin, Heart } from 'lucide-react'
import { supabase } from '../../lib/supabase'

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

export default function CommunityModPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!postsData?.length) {
      setPosts([])
      setLoading(false)
      return
    }

    const userIds = [...new Set(postsData.map((p) => p.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('id', userIds)

    const profileMap = {}
    ;(profiles || []).forEach((p) => { profileMap[p.id] = p })

    setPosts(postsData.map((p) => ({
      ...p,
      author_name: profileMap[p.user_id]?.full_name || 'Anónimo',
      author_role: profileMap[p.user_id]?.role || 'user',
    })))
    setLoading(false)
  }

  async function deletePost(id) {
    await supabase.from('community_posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) return <p className="text-text-muted text-sm">Cargando posts...</p>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl mb-1">Comunidad</h1>
        <p className="text-text-secondary">{posts.length} posts en total</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">No hay posts todavía</p>
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
                      <span className="text-sm font-semibold">{post.author_name}</span>
                      {post.author_role === 'admin' && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 text-xs font-semibold">
                          ✓ Creadora
                        </span>
                      )}
                      <span className="text-xs text-text-muted ml-2">{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{style.label}</span>
                </div>

                <p className="text-sm leading-relaxed mb-3">{post.content}</p>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Heart size={14} />
                    {post.likes_count || 0}
                  </span>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-400 transition"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
