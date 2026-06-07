import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined text-tertiary text-[48px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-4 uppercase tracking-widest">
            Authenticating...
          </p>
        </div>
      </div>
    )
  }

  return token ? children : <Navigate to="/login" />
}