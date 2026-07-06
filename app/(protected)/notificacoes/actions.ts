"use server"

import { revalidatePath } from "next/cache"
import { apiFetch } from "@/lib/api"
import { getSession } from "@/lib/auth"

export async function marcarNotificacaoLida(id: number) {
  const session = await getSession()
  if (!session) throw new Error("Sessão expirada. Faça login novamente.")

  await apiFetch(`/api/notificacoes/${id}/lida`, {
    method: "PATCH",
    token: session.token,
  })

  revalidatePath("/notificacoes")
}
