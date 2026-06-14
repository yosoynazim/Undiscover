export type Article = {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  body: any
  featured: boolean
  read_time: number
  publishedAt: string
  cover_image: { url: string; alternativeText: string }
  author: Author
  category: Category
  tags: Tag[]
}

export type Author = {
  id: number
  name: string
  slug: string
  bio: string
  avatar: { url: string }
  twitter: string
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  color: string
}

export type Tag = {
  id: number
  name: string
  slug: string
}

export type Comment = {
  id: number
  documentId: string
  content: string
  authorName: string
  authorEmail: string
  createdAt: string
}