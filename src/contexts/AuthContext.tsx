import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { fetchAdminStatus } from '../lib/adminCheck'
import { getFirebaseAuth, isFirebaseConfigured } from '../lib/firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshAdmin: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapFirebaseAuthError(e: unknown): Error {
  if (e && typeof e === 'object' && 'code' in e) {
    const code = String((e as { code?: string }).code ?? '')
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found' ||
      code === 'auth/invalid-email'
    ) {
      return new Error('Invalid email or password.')
    }
    if (code === 'auth/too-many-requests') {
      return new Error('Too many sign-in attempts. Try again later.')
    }
    if (code === 'auth/unauthorized-domain') {
      return new Error(
        'This domain is not allowed for sign-in. In Firebase Console go to Authentication → Settings → Authorized domains and add your site URL (e.g. your Netlify domain).',
      )
    }
  }
  return e instanceof Error ? e : new Error(String(e))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(() => isFirebaseConfigured)

  const applyUser = useCallback(async (next: User | null) => {
    setUser(next)
    if (next) {
      const { isAdmin: admin, fetchError } = await fetchAdminStatus(next.uid, { authUser: next })
      setIsAdmin(fetchError ? false : admin)
    } else {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return
    }

    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      void (async () => {
        try {
          await applyUser(nextUser)
        } finally {
          setLoading(false)
        }
      })()
    })

    return () => unsub()
  }, [applyUser])

  const refreshAdmin = useCallback(async () => {
    if (user) {
      const { isAdmin: admin, fetchError } = await fetchAdminStatus(user.uid, { authUser: user })
      setIsAdmin(fetchError ? false : admin)
    }
  }, [user])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      return { error: new Error('Firebase is not configured') }
    }
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
      return { error: null }
    } catch (e) {
      return { error: mapFirebaseAuthError(e) }
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!isFirebaseConfigured) return
    await firebaseSignOut(getFirebaseAuth())
    setUser(null)
    setIsAdmin(false)
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    isAdmin,
    signIn,
    signOut,
    refreshAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- useAuth is part of the auth API
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
