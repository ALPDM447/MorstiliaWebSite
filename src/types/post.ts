export type Post = {
  id: string
  title: string
  slug: string | null
  excerpt: string | null
  body: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
