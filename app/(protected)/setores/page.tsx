import { Building2, Cpu, ClipboardList, User } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { CriarSetorForm } from "@/components/setores/criar-setor-form"
import { getSetores } from "@/lib/server-data"
import { getSession } from "@/lib/auth"

export default async function SetoresPage() {
  const [setores, session] = await Promise.all([getSetores(), getSession()])
  const podeCriar = session?.role === "SUPERVISOR" || session?.role === "ADMIN"

  return (
    <>
      <PageHeader
        title="Setores"
        description="Locais de instalação dos motores e seus responsáveis."
      />

      {podeCriar && (
        <div className="mb-4">
          <CriarSetorForm />
        </div>
      )}

      {setores.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nenhum setor cadastrado ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {setores.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Building2 className="size-5" />
                </span>
                {s.ordensAbertas > 0 && (
                  <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                    {s.ordensAbertas} OS aberta(s)
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-semibold">{s.nome}</h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="size-3.5" />
                {s.responsavel}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">{s.motores}</p>
                    <p className="text-xs text-muted-foreground">Motores</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">{s.ordensAbertas}</p>
                    <p className="text-xs text-muted-foreground">Ordens</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
