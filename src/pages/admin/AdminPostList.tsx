import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPosts } from '../../lib/firestorePosts'
import type { Post } from '../../types/post'
import './Admin.css'

export function AdminPostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const list = await fetchAllPosts()
        if (cancelled) return
        setError(null)
        setPosts(list)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p className="admin-muted">Loading posts…</p>
  if (error) return <p className="admin-error">{error}</p>

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1 style={{ fontSize: '28px', margin: 0 }}>Posts</h1>
        <Link
          to="/admin/posts/new"
          className="admin-btn"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="admin-muted">No posts yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/posts/${p.id}`}>{p.title}</Link>
                  </td>
                  <td>
                    <span
                      className={p.published ? 'admin-badge' : 'admin-badge admin-badge--draft'}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(p.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
