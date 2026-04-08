import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../pages/admin/Admin.css'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="admin-shell admin-shell--bare">
        <p className="admin-muted">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ forbidden: true }} />
  }

  return <>{children}</>
}
