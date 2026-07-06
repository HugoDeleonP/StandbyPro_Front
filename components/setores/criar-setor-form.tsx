"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { Plus, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { criarSetor, type SetorFormState } from "@/app/(protected)/setores/actions"

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      Criar setor
    </Button>
  )
}

export function CriarSetorForm() {
  const [showForm, setShowForm] = useState(false)
  const [state, formAction] = useActionState<SetorFormState, FormData>(criarSetor, undefined)

  useEffect(() => {
    if (state?.success) setShowForm(false)
  }, [state])

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <Plus className="size-4" />
        Novo setor
      </Button>
    )
  }

  return (
    <Card className="mb-4 w-full p-5">
      <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium">Nome do setor</label>
          <input id="nome" name="nome" required placeholder="Ex.: Linha de Produção A" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="responsavel" className="text-sm font-medium">Responsável</label>
          <input id="responsavel" name="responsavel" required placeholder="Ex.: Marina Lopes" className={inputClass} />
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
