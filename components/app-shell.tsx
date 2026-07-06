"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Cpu,
  ClipboardList,
  Wrench,
  Building2,
  Users,
  Menu,
  X,
  Search,
  Bell,
  CircleGauge,
  LogOut,
} from "lucide-react"
import { cn, } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/login/actions"
import type { Role } from "@/lib/auth"
import LogoutButton from "./logout/Exit"

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/motores", label: "Motores", icon: Cpu },
  { href: "/ordens", label: "Ordens de Serviço", icon: ClipboardList },
  { href: "/manutencoes", label: "Manutenções", icon: Wrench },
  { href: "/setores", label: "Setores", icon: Building2 },
  { href: "/usuarios", label: "Usuários", icon: Users, adminOnly: true },
]

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CircleGauge className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">StandbyPro</span>
        <span className="text-[11px] text-muted-foreground">Manutenção WEG</span>
      </span>
    </Link>
  )
}

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()
  const items = nav.filter((item) => !item.adminOnly || role === "ADMIN")
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

type AppShellSessionUser = {
  children: React.ReactNode
  name: string
  role: Role
}

export function AppShell({ children, name, role }: AppShellSessionUser) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-svh">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex gap-[10rem]">

        <div className="flex flex-col justify-between h-full">

          <div className="flex flex-col gap-[0.5rem]">
            <div className="px-1">
              <Brand />
            </div>

            <div className="mt-8 flex-1">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Navegação
              </p>
              <NavLinks role={role} />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-[2rem]">
            <div className="rounded-lg border border-sidebar-border bg-card p-3 w-full ">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{role}</p>
                </div>
              </div>

            </div>

            <LogoutButton/>
          </div>

        </div>

        
        

      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5">
            <div className="flex items-center justify-between px-1">
              <Brand />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="mt-8 flex-1">
              <NavLinks role={role} onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
          <div className="relative hidden max-w-md flex-1 items-center sm:flex">
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar motor, OS ou responsável..."
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/notificacoes">
              <Button variant="outline" size="icon-sm" aria-label="Notificações" className="relative">
                <Bell className="size-4" />
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-destructive" />
              </Button>
            </Link>
            
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary sm:hidden">
              AF
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
