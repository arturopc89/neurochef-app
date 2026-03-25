import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true })
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .is('parent_task_id', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    set({ tasks: data || [], loading: false })
  },

  fetchSubtasks: async (parentId) => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('parent_task_id', parentId)
      .order('sort_order', { ascending: true })

    return data || []
  },

  addTask: async ({ title, category, dueDate, parentTaskId }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: user.id,
        title,
        category: category || null,
        due_date: dueDate || null,
        parent_task_id: parentTaskId || null,
      }])
      .select()
      .single()

    if (error) return null

    if (!parentTaskId) {
      set((s) => ({ tasks: [data, ...s.tasks] }))
    }
    return data
  },

  toggleTask: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId)
    if (!task) return

    const isCompleted = !task.is_completed
    const completedAt = isCompleted ? new Date().toISOString() : null

    await supabase
      .from('tasks')
      .update({ is_completed: isCompleted, completed_at: completedAt })
      .eq('id', taskId)

    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, is_completed: isCompleted, completed_at: completedAt } : t
      ),
    }))
  },

  deleteTask: async (taskId) => {
    await supabase.from('tasks').delete().eq('id', taskId)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }))
  },

  updateTask: async (taskId, updates) => {
    const { data } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (data) {
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === taskId ? data : t)),
      }))
    }
  },
}))
