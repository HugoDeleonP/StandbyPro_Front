import { ShieldAlert } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { CriarUsuarioForm } from "@/components/usuarios/criar-usuario-form"
import { UsuariosTable } from "@/components/usuarios/usuarios-table"
import { getUsuarios } from "@/lib/server-data"
import { getSession } from "@/lib/auth"

export default async function UsuariosPage() {
  const session = await getSession()

  if (session?.role !== "ADMIN") {
    return (
      <>
        <PageHeader title="Usuários" />
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <ShieldAlert className="size-8 text-muted-foreground" />
          <p className="font-medium">Acesso restrito</p>
          <p className="text-sm text-muted-foreground">
            Somente administradores podem gerenciar usuários.
          </p>
        </Card>
      </>
    )
  }

  const usuarios = await getUsuarios()

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Controle de acesso por papel: técnico, supervisor e administrador."
      />

      <div className="mb-4">
        <CriarUsuarioForm />
      </div>

      <UsuariosTable usuarios={usuarios} />
    </>
  )
}
