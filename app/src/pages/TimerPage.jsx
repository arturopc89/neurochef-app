import { useEffect } from 'react'
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react'
import { useTimerStore } from '../stores/timerStore'

const presets = [
  { label: '15 / 3', focus: 15, break: 3, desc: 'Sprint corto' },
  { label: '25 / 5', focus: 25, break: 5, desc: 'Clásico' },
  { label: '45 / 10', focus: 45, break: 10, desc: 'Enfoque profundo' },
]

const breakSuggestions = [
  { emoji: '💧', text: 'Tomá un vaso de agua' },
  { emoji: '🌬️', text: 'Respirá profundo 5 veces' },
  { emoji: '🧘', text: 'Estirate 30 segundos' },
  { emoji: '👀', text: 'Mirá algo lejano por la ventana' },
  { emoji: '🎵', text: 'Escuchá tu canción favorita' },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function getRandomBreakSuggestion() {
  return breakSuggestions[Math.floor(Math.random() * breakSuggestions.length)]
}

export default function TimerPage() {
  const {
    mode, status, secondsLeft,
    focusMinutes, breakMinutes,
    todaySessions, todayMinutes,
    start, pause, reset, setSettings, fetchTodaySessions,
  } = useTimerStore()

  useEffect(() => {
    fetchTodaySessions()
  }, [fetchTodaySessions])

  const totalSeconds = mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const breakTip = getRandomBreakSuggestion()

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Timer de enfoque</h1>
        <p className="text-text-secondary">
          {mode === 'focus' ? 'Enfocate en una sola cosa.' : 'Tomate un momento para vos.'}
        </p>
      </div>

      {/* Presets */}
      {status === 'idle' && mode === 'focus' && (
        <div className="flex justify-center gap-3 mb-8">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setSettings(p.focus, p.break)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                focusMinutes === p.focus
                  ? 'bg-terra-400 text-white'
                  : 'bg-white border border-stone-200 text-text-secondary hover:bg-cream-dark'
              }`}
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-xs opacity-75">{p.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Timer circle */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <svg width="320" height="320" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="160" cy="160" r="140"
            fill="none"
            stroke={mode === 'focus' ? '#e8eede' : '#faeadb'}
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="160" cy="160" r="140"
            fill="none"
            stroke={mode === 'focus' ? '#5c7a38' : '#d4844a'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {mode === 'break' && (
            <Coffee size={24} className="text-terra-400 mb-2" />
          )}
          <span className={`font-display text-6xl ${mode === 'focus' ? 'text-sage-600' : 'text-terra-500'}`}>
            {formatTime(secondsLeft)}
          </span>
          <span className="text-text-muted text-sm mt-2">
            {mode === 'focus' ? 'Enfoque' : 'Pausa'}
          </span>
        </div>
      </div>

      {/* Break suggestion */}
      {mode === 'break' && (
        <div className="bg-terra-50 rounded-2xl p-4 mb-6 border border-terra-200">
          <p className="text-sm text-terra-600">
            <span className="mr-2">{breakTip.emoji}</span>
            {breakTip.text}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-10">
        {status === 'running' ? (
          <button
            onClick={pause}
            className="w-16 h-16 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center hover:bg-cream-dark transition"
          >
            <Pause size={24} className="text-text-primary" />
          </button>
        ) : (
          <button
            onClick={start}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition ${
              mode === 'focus'
                ? 'bg-sage-500 hover:bg-sage-600'
                : 'bg-terra-400 hover:bg-terra-500'
            }`}
          >
            <Play size={24} className="text-white ml-1" />
          </button>
        )}

        {status !== 'idle' && (
          <button
            onClick={reset}
            className="w-16 h-16 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center hover:bg-cream-dark transition"
          >
            <RotateCcw size={24} className="text-text-muted" />
          </button>
        )}
      </div>

      {/* Today's sessions */}
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <h3 className="font-body text-sm font-semibold mb-3">Sesiones de hoy</h3>
        {todaySessions.length === 0 ? (
          <p className="text-text-muted text-sm">
            Todavía no hiciste ninguna sesión hoy. ¡Dale play!
          </p>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-display text-terra-400">{todaySessions.length}</span>
              <span className="text-text-muted text-sm ml-2">
                {todaySessions.length === 1 ? 'sesión' : 'sesiones'}
              </span>
            </div>
            <div>
              <span className="text-2xl font-display text-sage-500">{todayMinutes}</span>
              <span className="text-text-muted text-sm ml-2">min de enfoque</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
