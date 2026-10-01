import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore(state => state.token)
  
  // Note: Since initAuth runs in useEffect in App, token might initially be null
  // We check localStorage directly for the initial render guard
  const hasToken = token || localStorage.getItem('token')
  
  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
