"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validarOrdem, type ValidarFormState } from "@/app/(protected)/ordens/actions"

function SubmitButtons() {
  const { pending } = useFormStatus()
  return (
    <div className="flex gap-2">
      <Button type="submit" name="aprovado" value="true" disabled={pending} size="sm">
        {pending && <Loader2 className="size-3.5 animate-spin" />}
        Aprovar
      </Button>
      <Button type="submit" name="aprovado" value="false" variant="destructive" disabled={pending} size="sm">
        Reprovar
      </Button>
    </div>
  )
}

export function ValidarOrdemForm({ ordemId }: { ordemId: number }) {
  const action = validarOrdem.bind(null, ordemId)
  const [state, formAction] = useActionState<ValidarFormState, FormData>(action, undefined)

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
      <textarea
        name="observacaoValidacao"
        required
        rows={2}
        placeholder="Observação de validação..."
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      />
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
      <SubmitButtons />
    </form>
  )
}
