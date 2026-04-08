import { Link } from 'react-router-dom'
import './Admin.css'

export function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>Dashboard</h1>
      <p className="admin-muted" style={{ marginBottom: '24px' }}>
        Manage blog posts published on the public site.
      </p>
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
        <li>
          <Link to="/admin/posts">All posts</Link>
        </li>
        <li>
          <Link to="/admin/posts/new">New post</Link>
        </li>
      </ul>
    </div>
  )
}
