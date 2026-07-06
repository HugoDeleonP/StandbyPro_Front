import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CircleGauge, Gauge, ShieldCheck, Wrench } from "lucide-react"
import { AuthForm } from "@/components/auth/auth-form"
import { getSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Acessar — StandbyPro",
  description: "Entre ou cadastre-se na plataforma de manutenção de motores WEG.",
}

const highlights = [
  {
    icon: Gauge,
    title: "Indicadores em tempo real",
    text: "Acompanhe disponibilidade, MTBF e ordens em aberto da frota.",
  },
  {
    icon: Wrench,
    title: "Manutenção planejada",
    text: "Preventiva, corretiva e preditiva em um só lugar.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso por perfil",
    text: "Técnicos, supervisores e administradores com permissões próprias.",
  },
]

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect("/")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Painel de marca */}
      <section className="relative hidden flex-col justify-between bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CircleGauge className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">StandbyPro</span>
            <span className="text-[11px] text-muted-foreground">Manutenção WEG</span>
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">
            Gestão inteligente da manutenção dos seus motores WEG.
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Centralize motores, ordens de serviço e o histórico de manutenções
            com indicadores que ajudam a reduzir paradas não planejadas.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {highlights.map((h) => {
              const Icon = h.icon
              return (
                <li key={h.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{h.title}</p>
                    <p className="text-sm text-muted-foreground">{h.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} StandbyPro. Todos os direitos reservados.
        </p>
      </section>

      {/* Formulário */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CircleGauge className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                StandbyPro
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Bem-vindo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse sua conta ou crie uma para continuar.
          </p>

          <div className="mt-6">
            <AuthForm />
          </div>
        </div>
      </section>
    </div>
  )
}
