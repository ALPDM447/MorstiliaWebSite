import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Admin.css'

export function AdminLayout() {
  const { signOut, user } = useAuth()

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <span className="admin-brand">Morstilia admin</span>
        <nav>
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/posts" className={({ isActive }) => (isActive ? 'active' : '')}>
            Posts
          </NavLink>
          <a href="/">View site</a>
          <button type="button" onClick={() => void signOut()}>
            Sign out
          </button>
        </nav>
        <span className="admin-user">{user?.email ?? ''}</span>
      </header>
      <main className="admin-main admin-main--wide">
        <Outlet />
      </main>
    </div>
  )
}
