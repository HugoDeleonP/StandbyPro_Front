"use server"

import { revalidatePath } from "next/cache"
import { apiFetch, ApiError } from "@/lib/api"
import { getSession } from "@/lib/auth"

export type MotorFormState = { error?: string; success?: boolean } | undefined

export async function cadastrarMotor(
  _prev: MotorFormState,
  formData: FormData,
): Promise<MotorFormState> {
  const session = await getSession()
  if (!session) return { error: "Sessão expirada. Faça login novamente." }

  const modelo = String(formData.get("modelo") ?? "").trim()
  const numeroSerie = String(formData.get("numeroSerie") ?? "").trim()
  const potenciaKw = Number(formData.get("potenciaKw"))
  const localizacao = String(formData.get("localizacao") ?? "").trim()
  const setor = String(formData.get("setor") ?? "").trim()
  const dataFabricacao = String(formData.get("dataFabricacao") ?? "").trim()

  if (!modelo || !numeroSerie || !localizacao || !setor || !potenciaKw) {
    return { error: "Preencha todos os campos obrigatórios." }
  }

  try {
    await apiFetch("/api/motores", {
      method: "POST",
      token: session.token,
      body: {
        modelo,
        numeroSerie,
        potenciaKw,
        localizacao,
        setor,
        dataFabricacao: dataFabricacao || null,
      },
    })
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message }
    return { error: "Erro inesperado ao cadastrar o motor." }
  }

  revalidatePath("/motores")
  revalidatePath("/")
  revalidatePath("/setores")
  return { success: true }
}

export async function atualizarStatusMotor(id: number, status: string) {
  const session = await getSession()
  if (!session) throw new Error("Sessão expirada. Faça login novamente.")

  await apiFetch(`/api/motores/${id}/status?status=${status}`, {
    method: "PATCH",
    token: session.token,
  })

  revalidatePath("/motores")
  revalidatePath("/")
  revalidatePath("/setores")
}
