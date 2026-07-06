import { Wrench, CheckCircle2, XCircle, Clock } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MaintenanceTypeBadge } from "@/components/status-badge"
import { formatDate } from "@/lib/data"
import { getOrdens } from "@/lib/server-data"

export default async function ManutencoesPage() {
  const [concluidas, canceladas] = await Promise.all([
    getOrdens("CONCLUIDA"),
    getOrdens("CANCELADA"),
  ])

  const historico = [...concluidas, ...canceladas].sort((a, b) =>
    (b.dataConclusao ?? b.dataAbertura).localeCompare(a.dataConclusao ?? a.dataAbertura),
  )

  const preventivas = historico.filter((o) => o.tipo === "PREVENTIVA").length
  const corretivas = historico.filter((o) => o.tipo === "CORRETIVA").length

  return (
    <>
      <PageHeader
        title="Manutenções"
        description="Histórico de ordens de serviço concluídas ou canceladas."
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Summary icon={Wrench} label="Registros" value={historico.length} />
        <Summary icon={CheckCircle2} label="Preventivas" value={preventivas} />
        <Summary icon={Clock} label="Corretivas" value={corretivas} />
        <Summary icon={XCircle} label="Canceladas" value={canceladas.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linha do tempo</CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma manutenção concluída ou cancelada ainda.
            </p>
          ) : (
            <ol className="relative ml-2 border-l border-border">
              {historico.map((o) => {
                const cancelada = o.status === "CANCELADA"
                return (
                  <li key={o.id} className="mb-6 ml-6 last:mb-0">
                    <span className="absolute -left-[9px] flex size-4 items-center justify-center rounded-full border border-border bg-card">
                      <span className={cancelada ? "size-1.5 rounded-full bg-destructive" : "size-1.5 rounded-full bg-primary"} />
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-medium">{o.motorNumeroSerie}</span>
                      <MaintenanceTypeBadge type={o.tipo} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(o.dataConclusao ?? o.dataAbertura)}
                      </span>
                      <span
                        className={
                          "ml-auto inline-flex items-center gap-1.5 text-xs font-medium " +
                          (cancelada ? "text-destructive" : "text-success")
                        }
                      >
                        {cancelada ? <XCircle className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                        {cancelada ? "Cancelada" : "Concluída"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{o.descricao}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Responsável: {o.tecnicoResponsavel}</span>
                      {o.observacaoValidacao && <span>Validação: {o.observacaoValidacao}</span>}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wrench
  label: string
  value: string | number
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}
