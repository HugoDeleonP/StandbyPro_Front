"use client"

import { useMemo, useState, useTransition } from "react"
import { Search, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MotorStatusBadge } from "@/components/status-badge"
import { labels, formatDate, type Motor, type StatusMotor } from "@/lib/data"
import { atualizarStatusMotor } from "@/app/(protected)/motores/actions"
import { CadastrarMotorForm } from "./cadastrar-motor-form"

const filters: { key: StatusMotor | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "OPERANTE", label: "Operante" },
  { key: "EM_MANUTENCAO", label: "Em manutenção" },
  { key: "INATIVO", label: "Inativo" },
]

const statusOptions: StatusMotor[] = ["OPERANTE", "EM_MANUTENCAO", "INATIVO"]

function MotorRow({ motor, onSelect }: { motor: Motor; onSelect: (m: Motor) => void }) {
  return (
    <button
      onClick={() => onSelect(motor)}
      className="flex w-full flex-col gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40 md:flex-row md:items-center"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{motor.numeroSerie}</span>
          <MotorStatusBadge status={motor.status} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {motor.modelo} · {motor.setor}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
          <Zap className="size-3.5" />
          {motor.potenciaKw} kW
        </div>
        <div className="text-sm text-muted-foreground">{motor.localizacao}</div>
      </div>
    </button>
  )
}

function MotorDetail({ motor, onClose }: { motor: Motor; onClose: () => void }) {
  const [status, setStatus] = useState<StatusMotor>(motor.status)
  const [pending, startTransition] = useTransition()

  const specs: { label: string; value: string }[] = [
    { label: "Modelo", value: motor.modelo },
    { label: "Número de série", value: motor.numeroSerie },
    { label: "Potência", value: `${motor.potenciaKw} kW` },
    { label: "Setor", value: motor.setor },
    { label: "Localização", value: motor.localizacao },
    { label: "Fabricação", value: formatDate(motor.dataFabricacao) },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative flex w-full max-w-md flex-col overflow-y-auto border-l border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{motor.numeroSerie}</h2>
            <p className="text-sm text-muted-foreground">{labels.statusMotor[motor.status]}</p>
          </div>
          <MotorStatusBadge status={motor.status} />
        </div>

        <dl className="mt-6 divide-y divide-border rounded-lg border border-border">
          {specs.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <dt className="text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-right text-sm font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="status" className="text-sm font-medium">
            Atualizar status
          </label>
          <div className="flex gap-2">
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusMotor)}
              className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {labels.statusMotor[s]}
                </option>
              ))}
            </select>
            <Button
              disabled={pending || status === motor.status}
              onClick={() => startTransition(() => atualizarStatusMotor(motor.id, status))}
            >
              Salvar
            </Button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 h-9 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-muted"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

export function MotorsList({ motors }: { motors: Motor[] }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<StatusMotor | "todos">("todos")
  const [selected, setSelected] = useState<Motor | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    return motors.filter((m) => {
      const matchesFilter = filter === "todos" || m.status === filter
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        m.numeroSerie.toLowerCase().includes(q) ||
        m.modelo.toLowerCase().includes(q) ||
        m.setor.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [motors, query, filter])

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex max-w-sm flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Buscar por número de série, modelo ou setor..."
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
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
      </div>

      {showForm && <CadastrarMotorForm onDone={() => setShowForm(false)} />}
      {!showForm && (
        <Button variant="outline" className="mb-4" onClick={() => setShowForm(true)}>
          Cadastrar motor
        </Button>
      )}

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Nenhum motor encontrado para os filtros selecionados.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((m) => (
              <MotorRow key={m.id} motor={m} onSelect={setSelected} />
            ))}
          </div>
        )}
      </Card>

      {selected && <MotorDetail motor={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
