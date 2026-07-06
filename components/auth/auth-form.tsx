"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react"
import { signIn, signUp, type AuthState } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Mode = "login" | "signup"

function Field({
  label,
  children,
  htmlFor,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function SubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="mt-1 w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : mode === "login" ? (
        <LogIn className="size-4" />
      ) : (
        <UserPlus className="size-4" />
      )}
      {mode === "login" ? "Entrar" : "Criar conta"}
    </Button>
  )
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login")
  const [showPassword, setShowPassword] = useState(false)

  const action = mode === "login" ? signIn : signUp
  const [state, formAction] = useActionState<AuthState, FormData>(
    action,
    undefined,
  )

  return (
    <div className="w-full">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-card p-1">
        {(["login", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              mode === m
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "login" ? "Entrar" : "Cadastrar"}
          </button>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {mode === "signup" && (
          <Field label="Nome completo" htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ex.: João da Silva"
              className={inputClass}
              required
            />
          </Field>
        )}

        <Field label="E-mail" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com.br"
            className={inputClass}
            required
          />
        </Field>

        <Field label="Senha" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="Mínimo de 8 caracteres"
              className={cn(inputClass, "pr-10")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        {state?.error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.error}
          </p>
        )}

        <SubmitButton mode={mode} />
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {mode === "login"
          ? "Entre com o e-mail e senha cadastrados no StandbyPro."
          : "O autocadastro cria um acesso de Técnico. Contas de Supervisor/Administrador são criadas pelo administrador em Usuários."}
      </p>
    </div>
  )
}
