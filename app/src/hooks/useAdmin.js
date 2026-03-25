import { useAuthStore } from '../stores/authStore'

export function useAdmin() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const isAdmin = profile?.role === 'admin'
  return { isAdmin, user, profile }
}
