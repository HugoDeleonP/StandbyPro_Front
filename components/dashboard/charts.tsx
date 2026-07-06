"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const COLORS = {
  preventiva: "var(--chart-3)",
  corretiva: "var(--chart-5)",
  preditiva: "var(--chart-2)",
}

function TooltipBox({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium text-popover-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export type MaintenanceTrendPoint = {
  mes: string
  preventiva: number
  corretiva: number
  preditiva: number
}

export function MaintenanceTrendChart({ data }: { data: MaintenanceTrendPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="mes"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            width={28}
          />
          <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<TooltipBox />} />
          <Bar dataKey="preventiva" fill={COLORS.preventiva} radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="preditiva" fill={COLORS.preditiva} radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="corretiva" fill={COLORS.corretiva} radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatusDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[]
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex items-center gap-6">
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">{total}</span>
          <span className="text-xs text-muted-foreground">motores</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-medium">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
