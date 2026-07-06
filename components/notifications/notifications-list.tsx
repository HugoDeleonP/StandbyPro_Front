"use client"

import { useMemo, useState, useTransition } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, type Notificacao } from "@/lib/data"
import { marcarNotificacaoLida } from "@/app/(protected)/notificacoes/actions"

const filters: { key: "todas" | "nao_lidas"; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "nao_lidas", label: "Não lidas" },
]

function NotificacaoRow({ notificacao }: { notificacao: Notificacao }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {notificacao.lida ? (
            <BellOff className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <Bell className="size-4 shrink-0 text-primary" />
          )}
          <p className={cn("text-sm", !notificacao.lida && "font-medium")}>{notificacao.mensagem}</p>
        </div>
        <p className="mt-0.5 pl-6 text-xs text-muted-foreground">{formatDate(notificacao.criadaEm)}</p>
      </div>
      {!notificacao.lida && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => startTransition(() => marcarNotificacaoLida(notificacao.id))}
        >
          {pending && <Loader2 className="size-3.5 animate-spin" />}
          Marcar como lida
        </Button>
      )}
    </div>
  )
}

export function NotificationsList({ notificacoes }: { notificacoes: Notificacao[] }) {
  const [filter, setFilter] = useState<"todas" | "nao_lidas">("todas")

  const filtered = useMemo(() => {
    if (filter === "todas") return notificacoes
    return notificacoes.filter((n) => !n.lida)
  }, [notificacoes, filter])

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f.key
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Nenhuma notificação para os filtros selecionados.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((n) => (
              <NotificacaoRow key={n.id} notificacao={n} />
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
