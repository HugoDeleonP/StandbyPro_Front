"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { abrirOrdem, type OrdemFormState } from "@/app/(protected)/ordens/actions"
import type { Motor } from "@/lib/data"

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      Abrir ordem
    </Button>
  )
}

export function AbrirOrdemForm({ motores, onDone }: { motores: Motor[]; onDone: () => void }) {
  const [state, formAction] = useActionState<OrdemFormState, FormData>(abrirOrdem, undefined)

  useEffect(() => {
    if (state?.success) onDone()
  }, [state, onDone])

  return (
    <Card className="mb-4 p-5">
      <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="motorId" className="text-sm font-medium">Motor</label>
          <select id="motorId" name="motorId" required className={inputClass} defaultValue="">
            <option value="" disabled>Selecione um motor</option>
            {motores.map((m) => (
              <option key={m.id} value={m.id}>
                {m.numeroSerie} — {m.modelo}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tipo" className="text-sm font-medium">Tipo de manutenção</label>
          <select id="tipo" name="tipo" required className={inputClass} defaultValue="PREVENTIVA">
            <option value="PREVENTIVA">Preventiva</option>
            <option value="CORRETIVA">Corretiva</option>
            <option value="PREDITIVA">Preditiva</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="descricao" className="text-sm font-medium">Descrição</label>
          <textarea id="descricao" name="descricao" required rows={3} className={inputClass} />
        </div>

        {state?.error && (
          <p role="alert" className="sm:col-span-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-2 sm:col-span-2">
          <SubmitButton />
          <Button type="button" variant="outline" onClick={onDone}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
