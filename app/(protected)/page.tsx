import Link from "next/link"
import {
  Cpu,
  ClipboardList,
  ShieldAlert,
  Activity,
  ArrowRight,
  Bell,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { MaintenanceTrendChart, StatusDonut, type MaintenanceTrendPoint } from "@/components/dashboard/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge, MaintenanceTypeBadge } from "@/components/status-badge"
import { formatDate, type OrdemServico } from "@/lib/data"
import { getMotores, getOrdens, getNotificacoes } from "@/lib/server-data"

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function buildTrend(ordens: OrdemServico[]): MaintenanceTrendPoint[] {
  const buckets = new Map<string, MaintenanceTrendPoint>()
  for (const o of ordens) {
    const chave = o.dataAbertura.slice(0, 7)
    if (!buckets.has(chave)) {
      const mesIndex = Number(chave.slice(5, 7)) - 1
      buckets.set(chave, { mes: MESES[mesIndex] ?? chave, preventiva: 0, corretiva: 0, preditiva: 0 })
    }
    const bucket = buckets.get(chave)!
    if (o.tipo === "PREVENTIVA") bucket.preventiva++
    else if (o.tipo === "CORRETIVA") bucket.corretiva++
    else if (o.tipo === "PREDITIVA") bucket.preditiva++
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, v]) => v)
}

export default async function DashboardPage() {
  const [motores, ordens, notificacoes] = await Promise.all([
    getMotores(),
    getOrdens(),
    getNotificacoes(),
  ])

  const total = motores.length
  const operantes = motores.filter((m) => m.status === "OPERANTE").length
  const emManutencao = motores.filter((m) => m.status === "EM_MANUTENCAO").length
  const inativos = motores.filter((m) => m.status === "INATIVO").length
  const ordensAbertas = ordens.filter((o) => o.status === "ABERTA" || o.status === "EM_ANDAMENTO").length
  const concluidas = ordens.filter((o) => o.status === "CONCLUIDA").length
  const disponibilidade = total > 0 ? Math.round((operantes / total) * 100) : 0

  const donut = [
    { name: "Operante", value: operantes, color: "var(--chart-3)" },
    { name: "Em manutenção", value: emManutencao, color: "var(--chart-2)" },
    { name: "Inativo", value: inativos, color: "var(--chart-5)" },
  ]

  const trend = buildTrend(ordens)
  const recentes = [...ordens].sort((a, b) => b.dataAbertura.localeCompare(a.dataAbertura)).slice(0, 5)
  const atividadeRecente = notificacoes.slice(0, 4)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral dos motores WEG, manutenções e ordens de serviço do setor piloto."
        action={
          <Button nativeButton={false} render={<Link href="/ordens" />}>
            <ClipboardList className="size-4" />
            Nova ordem de serviço
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Motores cadastrados" value={total} icon={Cpu} tone="primary" />
        <KpiCard
          label="Disponibilidade da frota"
          value={disponibilidade}
          unit="%"
          icon={Activity}
          tone="success"
          trendLabel={`${operantes} de ${total} operantes`}
        />
        <KpiCard
          label="Ordens em aberto"
          value={ordensAbertas}
          icon={ClipboardList}
          tone="accent"
          trendLabel={`${concluidas} concluída(s)`}
        />
        <KpiCard
          label="Motores em manutenção"
          value={emManutencao + inativos}
          icon={ShieldAlert}
          tone="warning"
          trendLabel="Requerem atenção"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Ordens de serviço por mês</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Distribuição entre preventiva, preditiva e corretiva
              </p>
            </div>
            <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
              <Legend color="var(--chart-3)" label="Preventiva" />
              <Legend color="var(--chart-2)" label="Preditiva" />
              <Legend color="var(--chart-5)" label="Corretiva" />
            </div>
          </CardHeader>
          <CardContent>
            {trend.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Sem ordens registradas ainda.</p>
            ) : (
              <MaintenanceTrendChart data={trend} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos motores</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDonut data={donut} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ordens de serviço recentes</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/ordens" />}
            >
              Ver todas
              <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentes.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhuma ordem aberta ainda.</p>
            ) : (
              <div className="divide-y divide-border">
                {recentes.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">OS-{o.id}</span>
                        <MaintenanceTypeBadge type={o.tipo} />
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {o.motorNumeroSerie} — {o.descricao}
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/notificacoes" />}
            >
              Ver todas
              <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {atividadeRecente.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">Sem atividade ainda.</p>
            ) : (
              <div className="divide-y divide-border">
                {atividadeRecente.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Bell className="size-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{n.mensagem}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(n.criadaEm)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
