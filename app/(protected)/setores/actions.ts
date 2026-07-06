"use server"

import { revalidatePath } from "next/cache"
import { apiFetch, ApiError } from "@/lib/api"
import { getSession } from "@/lib/auth"

export type SetorFormState = { error?: string; success?: boolean } | undefined

export async function criarSetor(
  _prev: SetorFormState,
  formData: FormData,
): Promise<SetorFormState> {
  const session = await getSession()
  if (!session) return { error: "Sessão expirada. Faça login novamente." }

  const nome = String(formData.get("nome") ?? "").trim()
  const responsavel = String(formData.get("responsavel") ?? "").trim()

  if (!nome || !responsavel) {
    return { error: "Preencha todos os campos obrigatórios." }
  }

  try {
    await apiFetch("/api/setores", {
      method: "POST",
      token: session.token,
      body: { nome, responsavel },
    })
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message }
    return { error: "Erro inesperado ao criar o setor." }
  }

  revalidatePath("/setores")
  return { success: true }
}
