import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import AppLayout from './components/Layout/AppLayout'
import LoginPage from './components/Auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import TimerPage from './pages/TimerPage'
import NutritionPage from './pages/NutritionPage'
import CommunityPage from './pages/CommunityPage'

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-text-muted">Cargando...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />
  return children
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tareas" element={<TasksPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/nutricion" element={<NutritionPage />} />
          <Route path="/comunidad" element={<CommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
