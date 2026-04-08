import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getDb } from './firebase'

export type AdminStatus = {
  isAdmin: boolean
  /** Set when Firestore read fails (e.g. permission-denied, wrong project). */
  fetchError: string | null
}

/**
 * Reads admins/{uid}. Pass authUser so we can refresh the ID token first — right after
 * sign-in, Firestore may reject reads until the token is attached to the client.
 */
export async function fetchAdminStatus(
  uid: string,
  options?: { authUser?: User | null },
): Promise<AdminStatus> {
  if (options?.authUser) {
    try {
      await options.authUser.getIdToken(true)
    } catch {
      // Still attempt Firestore read; failure will surface in fetchError.
    }
  }

  try {
    const snap = await getDoc(doc(getDb(), 'admins', uid))
    return { isAdmin: snap.exists(), fetchError: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { isAdmin: false, fetchError: msg }
  }
}
