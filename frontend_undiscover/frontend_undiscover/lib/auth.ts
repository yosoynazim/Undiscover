export type AuthUser = {
  id: number
  username: string
  email: string
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!

export async function loginUser(
  identifier: string,
  password: string
): Promise<{ jwt: string; user: AuthUser }> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message ?? 'Error al iniciar sesión')
  }
  return res.json()
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message ?? 'Error al registrarse')
  }
}
