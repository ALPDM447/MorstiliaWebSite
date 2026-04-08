import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Post } from '../types/post'
import { getDb } from './firebase'

function tsToIso(value: Timestamp | null | undefined): string | null {
  if (!value) return null
  try {
    return value.toDate().toISOString()
  } catch {
    return null
  }
}

export function docToPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    title: String(data.title ?? ''),
    slug: data.slug != null ? String(data.slug) : null,
    excerpt: data.excerpt != null ? String(data.excerpt) : null,
    body: String(data.body ?? ''),
    published: Boolean(data.published),
    published_at: tsToIso(data.publishedAt as Timestamp | undefined),
    created_at: tsToIso(data.createdAt as Timestamp | undefined) ?? new Date().toISOString(),
    updated_at: tsToIso(data.updatedAt as Timestamp | undefined) ?? new Date().toISOString(),
  }
}

export async function fetchPublishedPosts(): Promise<Post[]> {
  const db = getDb()
  const q = query(
    collection(db, 'posts'),
    where('published', '==', true),
    orderBy('publishedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToPost(d.id, d.data() as Record<string, unknown>))
}

export async function fetchAllPosts(): Promise<Post[]> {
  const db = getDb()
  const q = query(collection(db, 'posts'), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToPost(d.id, d.data() as Record<string, unknown>))
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const ref = doc(getDb(), 'posts', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return docToPost(snap.id, snap.data() as Record<string, unknown>)
}

export async function isSlugInUse(slug: string, excludePostId?: string): Promise<boolean> {
  if (!slug) return false
  const q = query(collection(getDb(), 'posts'), where('slug', '==', slug), limit(5))
  const snap = await getDocs(q)
  return snap.docs.some((d) => d.id !== excludePostId)
}

type SavePayload = {
  title: string
  slug: string | null
  excerpt: string | null
  body: string
  published: boolean
  publishedAtIso: string | null
}

function buildFirestoreFields(payload: SavePayload, isNew: boolean) {
  const publishedAt =
    payload.published && payload.publishedAtIso
      ? Timestamp.fromDate(new Date(payload.publishedAtIso))
      : null

  const base = {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    body: payload.body,
    published: payload.published,
    publishedAt,
    updatedAt: serverTimestamp(),
  }

  if (isNew) {
    return { ...base, createdAt: serverTimestamp() }
  }
  return base
}

export async function createPost(payload: SavePayload): Promise<string> {
  const ref = await addDoc(collection(getDb(), 'posts'), buildFirestoreFields(payload, true))
  return ref.id
}

export async function updatePost(postId: string, payload: SavePayload): Promise<void> {
  await updateDoc(doc(getDb(), 'posts', postId), buildFirestoreFields(payload, false))
}

export async function deletePost(postId: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'posts', postId))
}
