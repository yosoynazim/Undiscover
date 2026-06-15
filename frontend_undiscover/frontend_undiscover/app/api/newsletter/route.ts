import { subscribeToNewsletter } from '@/lib/strapi'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Email inválido' }, { status: 400 })
    }
    await subscribeToNewsletter(email)
    return Response.json({ ok: true })
  } catch (e: any) {
    return Response.json({ error: e.message ?? 'Error' }, { status: 400 })
  }
}
