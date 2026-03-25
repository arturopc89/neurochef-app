import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useCommunityStore = create((set, get) => ({
  posts: [],
  loading: false,
  filter: 'todos',

  fetchPosts: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    const filter = get().filter
    if (filter !== 'todos') {
      query = query.eq('category', filter)
    }

    const { data: posts } = await query

    if (!posts?.length) {
      set({ posts: [], loading: false })
      return
    }

    // Fetch profile names for post authors
    const userIds = [...new Set(posts.map((p) => p.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)

    const profileMap = {}
    ;(profiles || []).forEach((p) => { profileMap[p.id] = p.full_name })

    // Check which posts the current user has liked
    let likedIds = new Set()
    if (user) {
      const { data: likes } = await supabase
        .from('community_post_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', posts.map((p) => p.id))

      likedIds = new Set((likes || []).map((l) => l.post_id))
    }

    set({
      posts: posts.map((p) => ({
        ...p,
        author_name: profileMap[p.user_id] || 'Anónimo',
        liked: likedIds.has(p.id),
      })),
      loading: false,
    })
  },

  setFilter: (filter) => {
    set({ filter })
    get().fetchPosts()
  },

  addPost: async (content, category) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('community_posts')
      .insert([{ user_id: user.id, content, category }])
      .select()
      .single()

    if (!error && data) {
      const name = user.user_metadata?.full_name || 'Anónimo'
      set((s) => ({ posts: [{ ...data, author_name: name, liked: false }, ...s.posts] }))
    }
  },

  toggleLike: async (postId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const post = get().posts.find((p) => p.id === postId)
    if (!post) return

    if (post.liked) {
      await supabase.from('community_post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      await supabase.from('community_posts').update({ likes_count: Math.max(0, post.likes_count - 1) }).eq('id', postId)
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId ? { ...p, liked: false, likes_count: Math.max(0, p.likes_count - 1) } : p
        ),
      }))
    } else {
      await supabase.from('community_post_likes').insert([{ post_id: postId, user_id: user.id }])
      await supabase.from('community_posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId)
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId ? { ...p, liked: true, likes_count: p.likes_count + 1 } : p
        ),
      }))
    }
  },

  deletePost: async (postId) => {
    await supabase.from('community_posts').delete().eq('id', postId)
    set((s) => ({ posts: s.posts.filter((p) => p.id !== postId) }))
  },
}))
