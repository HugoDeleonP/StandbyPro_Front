import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendLabel,
  tone = "primary",
}: {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  tone?: "primary" | "success" | "warning" | "destructive" | "accent"
}) {
  const toneCls: Record<string, string> = {
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    accent: "bg-accent/15 text-accent",
  }
  const positive = (trend ?? 0) >= 0
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-lg", toneCls[tone])}>
          <Icon className="size-5" />
        </span>
        {typeof trend === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        {trendLabel && (
          <p className="mt-2 text-xs text-muted-foreground">{trendLabel}</p>
        )}
      </div>
    </Card>
  )
}
