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
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import LeadsPage from './pages/admin/LeadsPage'
import UsersPage from './pages/admin/UsersPage'
import CommunityModPage from './pages/admin/CommunityModPage'
import RecipesPage from './pages/admin/RecipesPage'
import NotificationsPage from './pages/admin/NotificationsPage'

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
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="comunidad" element={<CommunityModPage />} />
          <Route path="recetas" element={<RecipesPage />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
