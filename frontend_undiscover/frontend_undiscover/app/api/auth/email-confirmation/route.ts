import { NextRequest } from 'next/server'

const BACKEND = 'https://strapi-api-production.up.railway.app'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('confirmation')
  if (!code) {
    return Response.json({ error: 'Falta el código de confirmación' }, { status: 400 })
  }

  try {
    const backendUrl = `${BACKEND}/api/auth/email-confirmation?confirmation=${encodeURIComponent(code)}`
    const response = await fetch(backendUrl, { redirect: 'manual' })

    const headers = new Headers()
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (!['transfer-encoding', 'content-encoding', 'connection'].includes(lower)) {
        headers.set(key, value)
      }
    })

    const body = response.status >= 300 && response.status < 400 ? null : await response.text()

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch {
    return Response.json({ error: 'Error al conectar con el servidor' }, { status: 502 })
  }
}
