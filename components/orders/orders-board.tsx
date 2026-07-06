"use client"

import { useState, useTransition } from "react"
import { LayoutGrid, List, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  OrderStatusBadge,
  MaintenanceTypeBadge,
} from "@/components/status-badge"
import {
  labels,
  formatDate,
  type OrdemServico,
  type StatusOrdemServico,
  type Motor,
  type Role,
} from "@/lib/data"
import { iniciarOrdem, concluirOrdem } from "@/app/(protected)/ordens/actions"
import { AbrirOrdemForm } from "./abrir-ordem-form"
import { ValidarOrdemForm } from "./validar-ordem-form"

const columns: { key: StatusOrdemServico; label: string; accent: string }[] = [
  { key: "ABERTA", label: "Aberta", accent: "bg-muted-foreground" },
  { key: "EM_ANDAMENTO", label: "Em andamento", accent: "bg-primary" },
  { key: "CONCLUIDA", label: "Concluída", accent: "bg-success" },
  { key: "CANCELADA", label: "Cancelada", accent: "bg-destructive" },
]

function OrderCard({ order, podeValidar }: { order: OrdemServico; podeValidar: boolean }) {
  const [pending, startTransition] = useTransition()
  const [validando, setValidando] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium">OS-{order.id}</span>
        <MaintenanceTypeBadge type={order.tipo} />
      </div>
      <p className="mt-2 text-sm text-foreground">{order.descricao}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">{order.motorNumeroSerie}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <User className="size-3.5" />
          {order.tecnicoResponsavel}
        </span>
        <span>{formatDate(order.dataAbertura)}</span>
      </div>

      <div className="mt-3 flex gap-2">
        {order.status === "ABERTA" && (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => iniciarOrdem(order.id))}
          >
            {pending && <Loader2 className="size-3.5 animate-spin" />}
            Iniciar
          </Button>
        )}
        {order.status === "EM_ANDAMENTO" && (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => concluirOrdem(order.id))}
          >
            {pending && <Loader2 className="size-3.5 animate-spin" />}
            Concluir
          </Button>
        )}
        {order.status === "CONCLUIDA" && podeValidar && !validando && (
          <Button size="sm" variant="outline" onClick={() => setValidando(true)}>
            Validar
          </Button>
        )}
      </div>

      {validando && <ValidarOrdemForm ordemId={order.id} />}
    </Card>
  )
}

export function OrdersBoard({
  ordens,
  motores,
  role,
}: {
  ordens: OrdemServico[]
  motores: Motor[]
  role: Role
}) {
  const [view, setView] = useState<"board" | "list">("board")
  const [showForm, setShowForm] = useState(false)
  const podeValidar = role === "SUPERVISOR" || role === "ADMIN"

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {ordens.length} ordens no setor piloto
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancelar" : "Nova ordem"}
          </Button>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setView("board")}
              aria-pressed={view === "board"}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                view === "board" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-3.5" />
              Quadro
            </button>
            <button
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-3.5" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {showForm && <AbrirOrdemForm motores={motores} onDone={() => setShowForm(false)} />}

      {view === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const items = ordens.filter((o) => o.status === col.key)
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", col.accent)} />
                  <h3 className="text-sm font-medium">{col.label}</h3>
                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      Sem ordens
                    </p>
                  ) : (
                    items.map((o) => <OrderCard key={o.id} order={o} podeValidar={podeValidar} />)
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Número</th>
                  <th className="px-5 py-3 font-medium">Motor</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Responsável</th>
                  <th className="px-5 py-3 font-medium">Abertura</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ordens.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3 font-mono font-medium">OS-{o.id}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.motorNumeroSerie}</td>
                    <td className="px-5 py-3">{labels.tipoManutencao[o.tipo]}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.tecnicoResponsavel}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(o.dataAbertura)}</td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}
