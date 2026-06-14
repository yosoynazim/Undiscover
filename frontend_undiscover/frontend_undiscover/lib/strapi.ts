const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;
const TOKEN = process.env.STRAPI_API_TOKEN;

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function fetchAPI(path: string) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers,
    next: { revalidate: process.env.NODE_ENV === 'development' ? 0 : 60 },
  });
  if (!res.ok) throw new Error(`Error fetching ${path}`);
  return res.json();
}

export async function getArticles() {
  const data = await fetchAPI("/articles?populate=*&sort=publishedAt:desc");
  return data.data;
}

export async function getArticleBySlug(slug: string) {
  const data = await fetchAPI(
    `/articles?filters[slug][$eq]=${slug}&populate=*`
  );
  return data.data[0];
}

export async function getFeaturedArticles() {
  const data = await fetchAPI(
    "/articles?filters[featured][$eq]=true&populate=*&sort=publishedAt:desc"
  );
  return data.data;
}

export async function getArticlesByCategory(slug: string) {
  const data = await fetchAPI(
    `/articles?filters[category][slug][$eq]=${slug}&populate=*&sort=publishedAt:desc`
  );
  return data.data;
}

export async function getCategories() {
  const data = await fetchAPI("/categories?populate=*");
  return data.data;
}

export async function getAuthorBySlug(slug: string) {
  const data = await fetchAPI(
    `/authors?filters[slug][$eq]=${slug}&populate=*`
  );
  return data.data[0];
}

export async function getArticlesByAuthor(slug: string) {
  const data = await fetchAPI(
    `/articles?filters[author][slug][$eq]=${slug}&populate=*&sort=publishedAt:desc`
  );
  return data.data;
}

export async function getComments(articleDocumentId: string) {
  const res = await fetch(
    `${STRAPI_URL}/api/comments?filters[article][documentId][$eq]=${articleDocumentId}&sort=createdAt:asc`,
    { cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.data ?? []
}

export async function postComment(
  content: string,
  articleDocumentId: string,
  authorName: string,
  authorEmail: string,
  jwt: string
) {
  const res = await fetch(`${STRAPI_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: { content, article: articleDocumentId, authorName, authorEmail },
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message ?? 'Error al publicar comentario')
  }
  return res.json()
}