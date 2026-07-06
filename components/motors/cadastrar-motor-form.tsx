"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cadastrarMotor, type MotorFormState } from "@/app/(protected)/motores/actions"

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      Cadastrar
    </Button>
  )
}

export function CadastrarMotorForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState<MotorFormState, FormData>(cadastrarMotor, undefined)

  useEffect(() => {
    if (state?.success) onDone()
  }, [state, onDone])

  return (
    <Card className="mb-4 p-5">
      <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="modelo" className="text-sm font-medium">Modelo</label>
          <input id="modelo" name="modelo" required placeholder="Ex.: WEG W22 IR3 Premium" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="numeroSerie" className="text-sm font-medium">Número de série</label>
          <input id="numeroSerie" name="numeroSerie" required placeholder="Ex.: WEG2231009872" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="potenciaKw" className="text-sm font-medium">Potência (kW)</label>
          <input id="potenciaKw" name="potenciaKw" type="number" step="0.1" min="0" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="setor" className="text-sm font-medium">Setor</label>
          <input id="setor" name="setor" required placeholder="Ex.: Linha de Produção A" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="localizacao" className="text-sm font-medium">Localização</label>
          <input id="localizacao" name="localizacao" required placeholder="Ex.: Galpão 1 — Esteira principal" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dataFabricacao" className="text-sm font-medium">Data de fabricação</label>
          <input id="dataFabricacao" name="dataFabricacao" type="date" className={inputClass} />
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
