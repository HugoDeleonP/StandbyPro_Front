"use server"

import { revalidatePath } from "next/cache"
import { apiFetch, ApiError } from "@/lib/api"
import { getSession } from "@/lib/auth"

export type OrdemFormState = { error?: string; success?: boolean } | undefined

export async function abrirOrdem(
  _prev: OrdemFormState,
  formData: FormData,
): Promise<OrdemFormState> {
  const session = await getSession()
  if (!session) return { error: "Sessão expirada. Faça login novamente." }

  const motorId = Number(formData.get("motorId"))
  const tipo = String(formData.get("tipo") ?? "")
  const descricao = String(formData.get("descricao") ?? "").trim()

  if (!motorId || !tipo || !descricao) {
    return { error: "Preencha todos os campos obrigatórios." }
  }

  try {
    await apiFetch("/api/ordens-servico", {
      method: "POST",
      token: session.token,
      body: { motorId, tipo, descricao },
    })
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message }
    return { error: "Erro inesperado ao abrir a ordem de serviço." }
  }

  revalidatePath("/ordens")
  revalidatePath("/")
  revalidatePath("/setores")
  return { success: true }
}

async function transicionar(id: number, acao: "iniciar" | "concluir") {
  const session = await getSession()
  if (!session) throw new Error("Sessão expirada. Faça login novamente.")

  await apiFetch(`/api/ordens-servico/${id}/${acao}`, {
    method: "PATCH",
    token: session.token,
  })

  revalidatePath("/ordens")
  revalidatePath("/")
  revalidatePath("/manutencoes")
  revalidatePath("/setores")
}

export async function iniciarOrdem(id: number) {
  await transicionar(id, "iniciar")
}

export async function concluirOrdem(id: number) {
  await transicionar(id, "concluir")
}

export type ValidarFormState = { error?: string; success?: boolean } | undefined

export async function validarOrdem(
  id: number,
  _prev: ValidarFormState,
  formData: FormData,
): Promise<ValidarFormState> {
  const session = await getSession()
  if (!session) return { error: "Sessão expirada. Faça login novamente." }

  const observacaoValidacao = String(formData.get("observacaoValidacao") ?? "").trim()
  const aprovado = formData.get("aprovado") === "true"

  if (!observacaoValidacao) {
    return { error: "Informe uma observação de validação." }
  }

  try {
    await apiFetch(`/api/ordens-servico/${id}/validar`, {
      method: "PATCH",
      token: session.token,
      body: { observacaoValidacao, aprovado },
    })
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message }
    return { error: "Erro inesperado ao validar a ordem de serviço." }
  }

  revalidatePath("/ordens")
  revalidatePath("/")
  revalidatePath("/manutencoes")
  revalidatePath("/setores")
  return { success: true }
}
