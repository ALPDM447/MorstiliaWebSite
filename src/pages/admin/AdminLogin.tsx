import { type FormEvent, useEffect, useState } from 'react'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { fetchAdminStatus } from '../../lib/adminCheck'
import { getFirebaseAuth, isFirebaseConfigured } from '../../lib/firebase'
import './Admin.css'

export function AdminLogin() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    typeof (location.state as { from?: string } | null)?.from === 'string'
      ? (location.state as { from: string }).from
      : '/admin'
  const forbidden = Boolean((location.state as { forbidden?: boolean } | null)?.forbidden)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate(from, { replace: true })
    }
  }, [loading, user, isAdmin, navigate, from])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { error: err } = await signIn(email, password)
      if (err) {
        setError(err.message)
        return
      }

      const auth = getFirebaseAuth()
      const u = auth.currentUser
      if (!u) {
        setError('Sign-in did not complete.')
        return
      }

      const { isAdmin: adminOk, fetchError } = await fetchAdminStatus(u.uid, { authUser: u })
      if (fetchError) {
        await firebaseSignOut(auth)
        setError(
          `Could not verify admin in Firestore: ${fetchError}. Check that Firestore rules are published, the database exists, and your VITE_FIREBASE_* env matches this project.`,
        )
        return
      }

      if (!adminOk) {
        await firebaseSignOut(auth)
        setError(
          `This account is not an admin yet. In Firebase Console → Firestore, open collection "admins" and create a document whose ID is exactly this user’s UID: ${u.uid} (you can leave the document empty).`,
        )
        return
      }

      navigate(from, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="admin-shell admin-shell--bare">
        <div className="admin-login-card">
          <h1>Admin</h1>
          <p className="admin-error">
            Firebase is not configured. Add the <code>VITE_FIREBASE_*</code> variables to{' '}
            <code>.env.local</code> (see <code>.env.example</code>).
          </p>
          <Link to="/">Back to site</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell admin-shell--bare">
      <div className="admin-login-card">
        <h1>Admin sign in</h1>
        <p>
          Use a Firebase Auth user that has a matching document in the <code>admins</code> collection
          (document ID = your user UID).
        </p>

        {forbidden && user && !isAdmin && (
          <p className="admin-error">
            This account is not an admin.{' '}
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => void signOut()}>
              Sign out
            </button>
          </p>
        )}

        {error && <p className="admin-error">{error}</p>}

        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
              </button>
            </div>
          </div>
          <div className="admin-actions">
            <button type="submit" className="admin-btn" disabled={submitting || loading}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
            <Link to="/" className="admin-btn admin-btn--ghost" style={{ lineHeight: '1.2' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
