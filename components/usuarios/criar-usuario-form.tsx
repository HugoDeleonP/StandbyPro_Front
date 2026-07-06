"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { Plus, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { criarUsuario, type UsuarioFormState } from "@/app/(protected)/usuarios/actions"

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      Criar usuário
    </Button>
  )
}

export function CriarUsuarioForm() {
  const [showForm, setShowForm] = useState(false)
  const [state, formAction] = useActionState<UsuarioFormState, FormData>(criarUsuario, undefined)

  useEffect(() => {
    if (state?.success) setShowForm(false)
  }, [state])

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <Plus className="size-4" />
        Novo usuário
      </Button>
    )
  }

  return (
    <Card className="mb-4 w-full p-5">
      <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium">Nome completo</label>
          <input id="nome" name="nome" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-sm font-medium">Senha provisória</label>
          <input id="senha" name="senha" type="password" required placeholder="Mínimo de 8 caracteres" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="role" className="text-sm font-medium">Papel</label>
          <select id="role" name="role" required className={inputClass} defaultValue="TECNICO">
            <option value="TECNICO">Técnico</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="setor" className="text-sm font-medium">Setor (opcional)</label>
          <input id="setor" name="setor" placeholder="Ex.: Linha de Produção A" className={inputClass} />
        </div>

        {state?.error && (
          <p role="alert" className="sm:col-span-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-2 sm:col-span-2">
          <SubmitButton />
          <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
