import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createPost,
  deletePost,
  fetchPostById,
  isSlugInUse,
  updatePost,
} from '../../lib/firestorePosts'
import './Admin.css'

function slugify(raw: string): string {
  const s = raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'post'
}

export function AdminPostEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === undefined || id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [published, setPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState<string | null>(null)

  useEffect(() => {
    if (isNew || !id || id === 'new') {
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const p = await fetchPostById(id)
        if (cancelled) return
        if (!p) {
          setError('Post not found.')
          setLoading(false)
          return
        }
        setTitle(p.title)
        setSlug(p.slug ?? '')
        setExcerpt(p.excerpt ?? '')
        setBody(p.body)
        setPublished(p.published)
        setPublishedAt(p.published_at)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const finalSlug = (slug.trim() || slugify(title)).slice(0, 200)
    let nextPublishedAt = publishedAt
    if (published && !publishedAt) {
      nextPublishedAt = new Date().toISOString()
    }
    if (!published) {
      nextPublishedAt = null
    }

    const slugKey = finalSlug || null
    if (slugKey && (await isSlugInUse(slugKey, isNew ? undefined : id))) {
      setSaving(false)
      setError('Slug is already taken. Change the slug.')
      return
    }

    const payload = {
      title: title.trim(),
      slug: slugKey,
      excerpt: excerpt.trim() || null,
      body,
      published,
      publishedAtIso: nextPublishedAt,
    }

    try {
      if (isNew) {
        const newId = await createPost(payload)
        navigate(`/admin/posts/${newId}`, { replace: true })
      } else if (id) {
        await updatePost(id, payload)
        setPublishedAt(nextPublishedAt)
        navigate('/admin/posts')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (isNew || !id) return
    if (!confirm('Delete this post permanently?')) return
    setSaving(true)
    try {
      await deletePost(id)
      navigate('/admin/posts')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
    setSaving(false)
  }

  if (loading) return <p className="admin-muted">Loading…</p>

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        <Link to="/admin/posts">← Back to posts</Link>
      </p>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{isNew ? 'New post' : 'Edit post'}</h1>

      {error && <p className="admin-error">{error}</p>}

      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="admin-field">
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="post-slug">Slug (optional)</label>
          <input
            id="post-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Generated from title if empty"
          />
        </div>
        <div className="admin-field">
          <label htmlFor="post-excerpt">Excerpt</label>
          <textarea
            id="post-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            style={{ minHeight: 'unset' }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="post-body">Body</label>
          <textarea id="post-body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} />
        </div>

        <div className="admin-toggle-field" onClick={() => setPublished(!published)}>
          <div className="admin-toggle-info">
            <label htmlFor="post-published" className="admin-toggle-label" onClick={(e) => e.preventDefault()}>
              Publish Post
            </label>
            <span className="admin-toggle-desc">Make this post visible on the public blog.</span>
          </div>
          <label className="switch" onClick={(e) => e.stopPropagation()}>
            <input
              id="post-published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="admin-actions">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {!isNew && (
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              disabled={saving}
              onClick={() => void handleDelete()}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
