"use server"

import { revalidatePath } from "next/cache"
import { apiFetch, ApiError } from "@/lib/api"
import { getSession } from "@/lib/auth"

export type UsuarioFormState = { error?: string; success?: boolean } | undefined

export async function criarUsuario(
  _prev: UsuarioFormState,
  formData: FormData,
): Promise<UsuarioFormState> {
  const session = await getSession()
  if (!session) return { error: "Sessão expirada. Faça login novamente." }

  const nome = String(formData.get("nome") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const senha = String(formData.get("senha") ?? "")
  const role = String(formData.get("role") ?? "")
  const setor = String(formData.get("setor") ?? "").trim()

  if (!nome || !email || !senha || !role) {
    return { error: "Preencha todos os campos obrigatórios." }
  }
  if (senha.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres." }
  }

  try {
    await apiFetch("/api/usuarios", {
      method: "POST",
      token: session.token,
      body: { nome, email, senha, role, setor: setor || null },
    })
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message }
    return { error: "Erro inesperado ao criar o usuário." }
  }

  revalidatePath("/usuarios")
  return { success: true }
}

export async function alternarStatusUsuario(id: number, ativo: boolean) {
  const session = await getSession()
  if (!session) throw new Error("Sessão expirada. Faça login novamente.")

  await apiFetch(`/api/usuarios/${id}/status?ativo=${ativo}`, {
    method: "PATCH",
    token: session.token,
  })

  revalidatePath("/usuarios")
}
