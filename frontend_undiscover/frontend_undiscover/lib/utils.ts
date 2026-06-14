export function getStrapiMedia(url: string | null) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).toUpperCase()
}

export function readingTime(body: any): number {
  // estimación simple basada en bloques
  const text = JSON.stringify(body)
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}