"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api"
import {
  SESSION_COOKIE,
  encodeSession,
  type Role,
  type SessionUser,
} from "@/lib/auth"

const SESSION_MAX_AGE = 60 * 60 * 8 // 8 horas

export type AuthState = { error?: string } | undefined

type TokenResponse = { token: string; tipo: string; email: string; role: Role }
type PerfilResponse = { nome: string; email: string; role: Role }

async function setSession(user: SessionUser) {
  const store = await cookies()
  store.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

async function iniciarSessaoComToken(token: string) {
  const perfil = await apiFetch<PerfilResponse>("/api/auth/me", { token })
  await setSession({ token, email: perfil.email, nome: perfil.nome, role: perfil.role })
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Informe e-mail e senha." }
  }
  if (!email.includes("@")) {
    return { error: "Informe um e-mail válido." }
  }

  let resposta: TokenResponse
  try {
    resposta = await apiFetch<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: { email, senha: password },
    })
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 403 || err.status === 422) {
        return { error: "Credenciais inválidas." }
      }
      return { error: err.message }
    }
    return { error: "Erro inesperado ao entrar. Tente novamente." }
  }

  await iniciarSessaoComToken(resposta.token)
  redirect("/")
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!name || !email || !password) {
    return { error: "Preencha todos os campos." }
  }
  if (!email.includes("@")) {
    return { error: "Informe um e-mail válido." }
  }
  if (password.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres." }
  }

  // O autocadastro publico sempre cria um TECNICO (o backend ignora
  // qualquer role enviado) - contas SUPERVISOR/ADMIN sao criadas por um
  // ADMIN autenticado na tela de Usuarios.
  let resposta: TokenResponse
  try {
    resposta = await apiFetch<TokenResponse>("/api/auth/registro", {
      method: "POST",
      body: { nome: name, email, senha: password },
    })
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message }
    }
    return { error: "Erro inesperado ao criar a conta. Tente novamente." }
  }

  await iniciarSessaoComToken(resposta.token)
  redirect("/")
}

export async function signOut() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect("/login")
}
