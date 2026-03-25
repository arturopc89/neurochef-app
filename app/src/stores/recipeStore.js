import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useRecipeStore = create((set) => ({
  recipes: [],
  loading: false,
  activeFilter: 'todos',

  fetchRecipes: async () => {
    set({ loading: true })
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    set({ recipes: data || [], loading: false })
  },

  setFilter: (filter) => set({ activeFilter: filter }),
}))
