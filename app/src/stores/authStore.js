import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user ?? null
    let profile = null

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single()
      profile = data
    }

    set({ user, profile, loading: false })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      let p = null
      if (u) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', u.id)
          .single()
        p = data
      }
      set({ user: u, profile: p })
    })
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    return data
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
