import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useTimerStore = create((set, get) => ({
  // Timer state
  mode: 'focus', // 'focus' | 'break'
  status: 'idle', // 'idle' | 'running' | 'paused'
  secondsLeft: 25 * 60,
  intervalId: null,

  // Settings
  focusMinutes: 25,
  breakMinutes: 5,

  // Current session
  currentSessionId: null,

  // Today's stats
  todaySessions: [],
  todayMinutes: 0,

  setSettings: (focus, breakMins) => {
    const state = get()
    if (state.status !== 'idle') return
    set({
      focusMinutes: focus,
      breakMinutes: breakMins,
      secondsLeft: focus * 60,
    })
  },

  start: async () => {
    const state = get()
    if (state.status === 'running') return

    // If starting fresh focus session, create DB record
    if (state.mode === 'focus' && state.status === 'idle') {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('focus_sessions')
          .insert([{
            user_id: user.id,
            duration_minutes: state.focusMinutes,
            break_minutes: state.breakMinutes,
          }])
          .select()
          .single()
        if (data) set({ currentSessionId: data.id })
      }
    }

    const id = setInterval(() => {
      const s = get()
      if (s.secondsLeft <= 1) {
        clearInterval(s.intervalId)

        // Session completed
        if (s.mode === 'focus') {
          get().completeSession()
          set({
            mode: 'break',
            secondsLeft: s.breakMinutes * 60,
            status: 'idle',
            intervalId: null,
          })
        } else {
          set({
            mode: 'focus',
            secondsLeft: s.focusMinutes * 60,
            status: 'idle',
            intervalId: null,
          })
        }

        // Play notification sound
        try {
          const ctx = new AudioContext()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = 528
          osc.type = 'sine'
          gain.gain.value = 0.3
          osc.start()
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
          osc.stop(ctx.currentTime + 1.5)
        } catch {}

        return
      }
      set({ secondsLeft: s.secondsLeft - 1 })
    }, 1000)

    set({ status: 'running', intervalId: id })
  },

  pause: () => {
    const state = get()
    if (state.intervalId) clearInterval(state.intervalId)
    set({ status: 'paused', intervalId: null })
  },

  reset: () => {
    const state = get()
    if (state.intervalId) clearInterval(state.intervalId)
    set({
      status: 'idle',
      intervalId: null,
      mode: 'focus',
      secondsLeft: state.focusMinutes * 60,
      currentSessionId: null,
    })
  },

  completeSession: async () => {
    const state = get()
    if (!state.currentSessionId) return

    await supabase
      .from('focus_sessions')
      .update({ completed: true, ended_at: new Date().toISOString() })
      .eq('id', state.currentSessionId)

    set({ currentSessionId: null })
    get().fetchTodaySessions()
  },

  fetchTodaySessions: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .gte('started_at', today + 'T00:00:00')
      .order('started_at', { ascending: false })

    const sessions = data || []
    const minutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
    set({ todaySessions: sessions, todayMinutes: minutes })
  },
}))
