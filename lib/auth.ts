import { cookies } from "next/headers"

export const SESSION_COOKIE = "standbypro_session"

export type Role = "TECNICO" | "SUPERVISOR" | "ADMIN"

export type SessionUser = {
  token: string
  email: string
  nome: string
  role: Role
}

/**
 * Sessao guarda o JWT de verdade (retornado pelo backend) em cookie
 * httpOnly - o token nunca chega ao JS do navegador. So Server
 * Components/Server Actions leem a sessao e chamam a API com esse token.
 */
export function encodeSession(user: SessionUser): string {
  return JSON.stringify(user)
}

export function decodeSession(value: string | undefined): SessionUser | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed.token === "string" && typeof parsed.email === "string") {
      return parsed as SessionUser
    }
    return null
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  return decodeSession(store.get(SESSION_COOKIE)?.value)
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}
