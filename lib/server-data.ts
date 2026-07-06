// Fetchers server-side (Server Components) para a API Spring Boot. Cada
// funcao le o token da sessao e chama o backend via apiFetch (lib/api.ts).

import { redirect } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api"
import { getSession } from "@/lib/auth"
import type {
  Motor,
  Notificacao,
  OrdemServico,
  Setor,
  StatusOrdemServico,
  Usuario,
} from "@/lib/data"

async function tokenAtual(): Promise<string> {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session.token
}

// 401 so acontece se o token expirou/ficou invalido depois do login - manda
// de volta para a tela de login. Outros erros (403, 5xx, backend fora do ar)
// sobem para o app/(protected)/error.tsx, que mostra uma mensagem amigavel.
async function comTratamentoDeSessao<T>(chamada: () => Promise<T>): Promise<T> {
  try {
    return await chamada()
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login")
    }
    throw err
  }
}

export async function getMotores(): Promise<Motor[]> {
  const token = await tokenAtual()
  return comTratamentoDeSessao(() => apiFetch<Motor[]>("/api/motores", { token }))
}

export async function getOrdens(status?: StatusOrdemServico): Promise<OrdemServico[]> {
  const token = await tokenAtual()
  const path = status ? `/api/ordens-servico?status=${status}` : "/api/ordens-servico"
  return comTratamentoDeSessao(() => apiFetch<OrdemServico[]>(path, { token }))
}

export async function getUsuarios(): Promise<Usuario[]> {
  const token = await tokenAtual()
  return comTratamentoDeSessao(() => apiFetch<Usuario[]>("/api/usuarios", { token }))
}

export async function getSetores(): Promise<Setor[]> {
  const token = await tokenAtual()
  return comTratamentoDeSessao(() => apiFetch<Setor[]>("/api/setores", { token }))
}

export async function getNotificacoes(): Promise<Notificacao[]> {
  const token = await tokenAtual()
  return comTratamentoDeSessao(() => apiFetch<Notificacao[]>("/api/notificacoes", { token }))
}
