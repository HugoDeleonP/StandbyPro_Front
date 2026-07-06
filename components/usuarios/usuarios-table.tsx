"use client"

import { useTransition } from "react"
import { ShieldCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { labels, formatDate, type Usuario, type Role } from "@/lib/data"
import { alternarStatusUsuario } from "@/app/(protected)/usuarios/actions"

const roleCls: Record<Role, string> = {
  ADMIN: "border-primary/30 bg-primary/10 text-primary",
  SUPERVISOR: "border-accent/30 bg-accent/10 text-accent",
  TECNICO: "border-border bg-muted/40 text-muted-foreground",
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function StatusToggle({ usuario }: { usuario: Usuario }) {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      size="sm"
      variant={usuario.ativo ? "destructive" : "outline"}
      disabled={pending}
      onClick={() => startTransition(() => alternarStatusUsuario(usuario.id, !usuario.ativo))}
    >
      {pending && <Loader2 className="size-3.5 animate-spin" />}
      {usuario.ativo ? "Desativar" : "Ativar"}
    </Button>
  )
}

export function UsuariosTable({ usuarios }: { usuarios: Usuario[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Usuário</th>
              <th className="px-5 py-3 font-medium">Papel</th>
              <th className="px-5 py-3 font-medium">Setor</th>
              <th className="px-5 py-3 font-medium">Situação</th>
              <th className="px-5 py-3 font-medium">Criado em</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {usuarios.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {initials(u.nome)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                      roleCls[u.role],
                    )}
                  >
                    {u.role === "ADMIN" && <ShieldCheck className="size-3" />}
                    {labels.role[u.role]}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{u.setor ?? "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium",
                      u.ativo ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", u.ativo ? "bg-success" : "bg-muted-foreground")} />
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(u.criadoEm)}</td>
                <td className="px-5 py-3 text-right">
                  <StatusToggle usuario={u} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
