import { useEffect, useState } from 'react'
import { fetchPublishedPosts } from '../../lib/firestorePosts'
import { isFirebaseConfigured } from '../../lib/firebase'
import type { Post } from '../../types/post'
import '../../App.css'

function formatPostDate(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function renderBodyAsParagraphs(text: string) {
  const blocks = text.split(/\n\n+/).filter(Boolean)
  return blocks.map((block, i) => <p key={i}>{block}</p>)
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(() => isFirebaseConfigured)
  const [error, setError] = useState<string | null>(() =>
    isFirebaseConfigured
      ? null
      : 'Blog is not connected yet. Add VITE_FIREBASE_* variables to .env.local.',
  )

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return
    }

    let cancelled = false
    void (async () => {
      try {
        const list = await fetchPublishedPosts()
        if (cancelled) return
        setError(null)
        setPosts(list)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setPosts([])
      }
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="blog-section">
      <h1>Blog</h1>

      {loading && <p className="blog-hint">Loading…</p>}

      {!loading && error && <p className="blog-alert">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="blog-hint">No published posts yet. Check back soon.</p>
      )}

      <div className="blog-content">
        {!loading &&
          !error &&
          posts.map((post) => (
            <article key={post.id} className="blog-post">
              <h2>{post.title}</h2>
              <p className="post-date">{formatPostDate(post.published_at)}</p>
              {post.excerpt && <p>{post.excerpt}</p>}
              {renderBodyAsParagraphs(post.body)}
            </article>
          ))}
      </div>
    </section>
  )
}
