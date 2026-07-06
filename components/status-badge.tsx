import { cn } from "@/lib/utils"
import {
  labels,
  type StatusMotor,
  type StatusOrdemServico,
  type TipoManutencao,
} from "@/lib/data"

function Dot({ className }: { className?: string }) {
  return <span className={cn("size-1.5 rounded-full", className)} aria-hidden />
}

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"

export function MotorStatusBadge({ status }: { status: StatusMotor }) {
  const map: Record<StatusMotor, { cls: string; dot: string }> = {
    OPERANTE: { cls: "border-success/30 bg-success/10 text-success", dot: "bg-success" },
    EM_MANUTENCAO: { cls: "border-accent/30 bg-accent/10 text-accent", dot: "bg-accent" },
    INATIVO: { cls: "border-destructive/30 bg-destructive/10 text-destructive", dot: "bg-destructive" },
  }
  const s = map[status]
  return (
    <span className={cn(base, s.cls)}>
      <Dot className={s.dot} />
      {labels.statusMotor[status]}
    </span>
  )
}

export function OrderStatusBadge({ status }: { status: StatusOrdemServico }) {
  const map: Record<StatusOrdemServico, string> = {
    ABERTA: "border-border bg-muted/40 text-muted-foreground",
    EM_ANDAMENTO: "border-primary/30 bg-primary/10 text-primary",
    CONCLUIDA: "border-success/30 bg-success/10 text-success",
    CANCELADA: "border-destructive/30 bg-destructive/10 text-destructive",
  }
  return <span className={cn(base, map[status])}>{labels.statusOrdemServico[status]}</span>
}

export function MaintenanceTypeBadge({ type }: { type: TipoManutencao }) {
  const map: Record<TipoManutencao, string> = {
    PREVENTIVA: "border-success/30 bg-success/10 text-success",
    CORRETIVA: "border-destructive/30 bg-destructive/10 text-destructive",
    PREDITIVA: "border-accent/30 bg-accent/10 text-accent",
  }
  return <span className={cn(base, map[type])}>{labels.tipoManutencao[type]}</span>
}
