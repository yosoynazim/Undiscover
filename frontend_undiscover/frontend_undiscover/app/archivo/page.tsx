import { getArticles, getCategories } from '@/lib/strapi'
import { Article, Category } from '@/lib/types'
import TerminalArchivo from './TerminalArchivo'

export default async function ArchivoPage() {
  let articles: Article[] = []
  let categories: Category[] = []

  try {
    ;[articles, categories] = await Promise.all([getArticles(), getCategories()])
  } catch {}

  return <TerminalArchivo articles={articles} categories={categories} />
}
